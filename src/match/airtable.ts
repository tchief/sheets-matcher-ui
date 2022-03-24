import { MatchRequest } from './types';
import Airtable from 'airtable';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;

export const getRequests = (matchRequest: MatchRequest, mapRowToRequest: (row: any) => any) =>
  getRows(
    mapRowToRequest,
    AIRTABLE_API_KEY,
    matchRequest.requestSpreadsheetId,
    matchRequest.requestSheetId,
    matchRequest.requestIdsToFilter
  );
export const getProposals = (matchRequest: MatchRequest, mapRowToProposal: (row: any) => any) =>
  getRows(
    mapRowToProposal,
    AIRTABLE_API_KEY,
    matchRequest.proposalSpreadsheetId,
    matchRequest.proposalSheetId,
    matchRequest.proposalIdsToFilter
  );

const getRows = async (
  mapRow: (row: any) => any,
  AIRTABLE_API_KEY: string,
  BASE_ID: string,
  VIEW_ID: string,
  ids: number[] = []
) => {
  const baseIds = BASE_ID.split(',');
  const viewIds = VIEW_ID.split(',');

  const allRows = await Promise.all(baseIds.map(async (baseId, index) => {
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(baseId.trim());
    const rows: any[] = [];

    await base(viewIds[index].trim())
      // TODO: Pass fields from matchRequest to retieve, not all of them
      // TODO: Pass view as param, or default view: 'Matcher', sort: [{ field: 'ID', direction: 'desc' }]
      // TODO: Max records as param
      .select({ view: 'Matcher', maxRecords: 1000 })
      .eachPage(function page(fetchedRecords, fetchNextPage) {
        rows.push(...fetchedRecords);
        fetchNextPage();
      });

    // TODO: Unify id / rowIndex props.
    const filteredRows = ids?.length
      ? rows.filter((row) => ids.includes(row.rowIndex ?? row.id))
      : rows;
    return filteredRows?.map(mapRow);
  }));

  return allRows.flat();
};

export const getAirtableRetrieveFuncs = {
  getRequests,
  getProposals,
};
