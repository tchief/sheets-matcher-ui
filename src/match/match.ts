import { getAirtableRetrieveFuncs } from './airtable';
import getGenericMatchFuncs from './generic';
import getRefugeeMatchFuncs from './refugee';
import { getSheetsRetrieveFuncs } from './sheets';
import { Match, matchesToString, MatchRequest, split } from './types';

export const getMatches = async (matchRequest: MatchRequest): Promise<Match[]> => {
  const { filterRequests, filterProposals, match, mapRowToRequest, mapRowToProposal } =
    getMatchFuncs(matchRequest);

  const { getRequests, getProposals } = getRetrieveFuncs(matchRequest);

  const requests = (await getRequests(matchRequest, mapRowToRequest)).filter(filterRequests);
  const proposals = (await getProposals(matchRequest, mapRowToProposal)).filter(filterProposals);

  const matches: Match[] = requests
    .map((request) => ({ request, macthedProposals: proposals.filter((proposal) => match(request, proposal)) }))
    .map(({ request, macthedProposals }) => ({
      requestId: `${request.sheetTitle ? request.sheetTitle + ": " : ''}${request.rowNumber}`,
      proposalIds: macthedProposals
        .map((proposal) => `${proposal.sheetTitle ? proposal.sheetTitle + ": " : ''}${proposal.rowNumber}`),
      requestUrl: matchRequest.showUrls ? request.rowUrl : undefined,
      proposalUrls: matchRequest.showUrls ? macthedProposals.map((proposal) => proposal.rowUrl) : undefined
    }))
    .filter((match) => match.proposalIds.length > 0);

  // console.log({ proposals, requests, matches: matchesToString(matches) });

  return matches;
};

export const getMatchFuncs = (matchRequest: MatchRequest) =>
  matchRequest.matchType === 'un-refugee'
    ? getRefugeeMatchFuncs
    : getGenericMatchFuncs(matchRequest);

export const getRetrieveFuncs = (matchRequest: MatchRequest) =>
  matchRequest.sourceType === 'airtable'
    ? getAirtableRetrieveFuncs
    : matchRequest.sourceType === 'mixed' ? getMixedRetrieveFuncs(matchRequest) : getSheetsRetrieveFuncs;

const getMixedRetrieveFuncs = (matchRequest: MatchRequest) => {
  const { sheets, airtable } = splitMatchRequest(matchRequest);

  const getRequests = async (req: MatchRequest, map: (row: any) => any) => {
    const reqSheets = await getSheetsRetrieveFuncs.getRequests(sheets, map);
    const reqAirtable = await getAirtableRetrieveFuncs.getRequests(airtable, map);
    return [...reqSheets, ...reqAirtable];
  }

  const getProposals = async (req: MatchRequest, map: (row: any) => any) => {
    const reqSheets = await getSheetsRetrieveFuncs.getProposals(sheets, map);
    const reqAirtable = await getAirtableRetrieveFuncs.getProposals(airtable, map);
    return [...reqSheets, ...reqAirtable];
  }

  return { getRequests, getProposals };
}


const splitMatchRequest = (matchRequest: MatchRequest): { sheets: MatchRequest, airtable: MatchRequest } => {
  const requests = split(matchRequest.requestSpreadsheetId, matchRequest.requestSheetId);
  const proposals = split(matchRequest.proposalSpreadsheetId, matchRequest.proposalSheetId);

  const sheets: MatchRequest = {
    ...matchRequest, requestSpreadsheetId: requests.sheetsBases, requestSheetId: requests.sheetsTables,
    proposalSpreadsheetId: proposals.sheetsBases, proposalSheetId: proposals.sheetsTables
  };

  const airtable: MatchRequest = {
    ...matchRequest, requestSpreadsheetId: requests.airtableBases, requestSheetId: requests.airtableTables,
    proposalSpreadsheetId: proposals.airtableBases, proposalSheetId: proposals.airtableTables
  };

  return { sheets, airtable };
}
