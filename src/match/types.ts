import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';
import { CamelCaseToSnakeNested } from '../utils/utils';

export type MessengerTypes = 'telegram' | 'slack' | 'discord';
export type SourceTypes = 'sheets' | 'airtable' | 'mixed';
export interface MatchRequest {
  requestSpreadsheetId: string;
  requestSheetId: string;
  proposalSpreadsheetId: string;
  proposalSheetId: string;
  slug?: string;
  matchType?: string;
  sourceType?: SourceTypes;
  propsToBeEqual?: string;
  propsToBeGreater?: string;
  propsToHaveCommonWords?: string;
  propsToIgnore?: string;
  propsToFilter?: string;
  valuesToFilter?: string;
  requestIdsToFilter?: (string | number)[];
  proposalIdsToFilter?: (string | number)[];
  chatId?: string;
  columnsSendToChat?: string;
  messenger?: MessengerTypes;
  isPrivate?: boolean;
  showUrls?: boolean;
}

export type MatchRequestSnake = CamelCaseToSnakeNested<MatchRequest>;

export const camelToSnake = (matchRequest: MatchRequest): MatchRequestSnake =>
  // @ts-ignore
  snakecaseKeys(matchRequest);

export const snakeToCamel = (matchRequest: MatchRequestSnake): MatchRequest =>
  // @ts-ignore
  camelcaseKeys(matchRequest);

export const isValid = (matchRequest: MatchRequest): boolean =>
  matchRequest.requestSpreadsheetId?.length > 0 &&
  matchRequest.requestSheetId?.length > 0 &&
  matchRequest.proposalSpreadsheetId?.length > 0 &&
  matchRequest.proposalSheetId?.length > 0;

export interface Match {
  requestId: string | number;
  proposalIds: string[] | number[];
  requestUrl?: string | null;
  proposalUrls?: string[] | null;
}

export const proposalIdsToString = (match: Match) => match.proposalIds.join(',');
export const matchesToString = (matches: Match[]) =>
  matches.map((m) => `${m.requestId}: ${proposalIdsToString(m)}`).join('\n');

export const split = (bases: string, tables: string, prefix: string = "app") => {
  const allBases = bases.split(',').map(id => id.trim());
  const allTables = tables.split(',').map(id => id.trim());
  // @ts-ignore
  const [sheets, airtable] = allBases.reduce((result, item, index) => { result[+item.startsWith(prefix)].push(index); return result; }, [[], []])
  const sheetsBases = sheets.map(i => allBases[i]).join(',');
  const sheetsTables = sheets.map(i => allTables[i]).join(',');
  const airtableBases = airtable.map(i => allBases[i]).join(',');
  const airtableTables = airtable.map(i => allTables[i]).join(',');
  return { sheetsBases, sheetsTables, airtableBases, airtableTables };
}
