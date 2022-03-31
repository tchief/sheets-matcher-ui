import { camelToSnake, MatchRequest, MatchRequestSnake, snakeToCamel } from './../match/types';
import { createClient } from '@supabase/supabase-js';
import { Application } from '../types';
import { SupabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { useRealtimeRows } from './useRealtimeRows';

export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export const MATCHES_TABLE = "matches";

export const loadMatchRequest = async (slug: string) => {
  const { data, error } = await supabase
    .from<MatchRequestSnake>('match_requests')
    .select('*')
    .eq('slug', slug)
    .single();
  return { data: data ? snakeToCamel(data) : null, error };
};

export const saveMatchRequest = async (matchRequest: MatchRequest) =>
  await supabase
    .from('match_requests')
    .insert(camelToSnake(matchRequest), { returning: 'minimal' });

export const findCity = async (city: string, supa: SupabaseClient) =>
  await supa.rpc('search_cities', { city });

export const saveApplication = async (application: Application, supa: SupabaseClient) =>
  await supa.from('applications').insert(application, { returning: 'minimal' });

export const loadApplication = async (id: string) =>
  await supabase.from('applications').select('*').eq('id', id).single();

const COLUMNS = ['id', 'request_id', 'proposal_id', 'message'] as const;
const COLUMNS_LIST = COLUMNS.concat();
type Row = Record<typeof COLUMNS[number], string>;

export const useRealtimeMatches = (id: string) =>
  useRealtimeRows<Row>(MATCHES_TABLE, 'request_id', id, COLUMNS_LIST);