import { MatchRequest, split } from './types';
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
  const { airtableBases, airtableTables } = split(BASE_ID, VIEW_ID);
  const baseIds = airtableBases.split(',').map(id => id.trim());
  const viewIds = airtableTables.split(',').map(id => id.trim());

  const allRows = await Promise.all(baseIds.map(async (baseId, index) => {
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(baseId);
    const table = viewIds[index];
    const rows: any[] = [];

    await base(table)
      // TODO: Pass fields from matchRequest to retieve, not all of them
      // TODO: Pass view as param, or default view: 'Matcher', sort: [{ field: 'ID', direction: 'desc' }]
      // TODO: Max records as param
      .select({ view: 'Matcher', maxRecords: 1000 })
      .eachPage(function page(fetchedRecords, fetchNextPage) {
        rows.push(...fetchedRecords);
        fetchNextPage();
      });
    const getRowUrl = (r: any) => `https://airtable.com/${baseId}/${table}/${r.id}`;

    // TODO: Unify id / rowIndex props.
    const filteredRows = ids?.length
      ? rows.filter((row) => ids.includes(row.rowIndex ?? row.id))
      : rows;

    return filteredRows?.map(r => ({
      ...mapRow(r),
      sheetTitle: viewIds.length > 1 && !table.toString().startsWith("tbl") ? table : undefined,
      rowUrl: table.toString().startsWith("tbl") ? getRowUrl(r) : undefined
    }))
  }));

  return allRows.flat();
};

export const getAirtableRetrieveFuncs = {
  getRequests,
  getProposals,
};
