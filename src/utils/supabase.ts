import { camelToSnake, MatchRequest, MatchRequestSnake, snakeToCamel } from './../match/types';
import { createClient } from '@supabase/supabase-js';
import { Application } from '../types';

export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

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

export const findCity = async (city: string) =>
  await supabase.rpc('search_cities', { city });

export const saveApplication = async (application: Application) =>
  await supabase.from('applications').insert(application, { returning: 'minimal' });
