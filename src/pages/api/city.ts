import type { NextApiRequest, NextApiResponse } from 'next';
import { findCity } from '../../utils/supabase';
import {
    withAuthRequired,
    supabaseServerClient
} from '@supabase/supabase-auth-helpers/nextjs';

interface City {
    id?: number;
    city: string;
    district: string;
    region: string;
}

type Data = {
    cities: City[];
};

export default withAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const search = req.query.search as string;
    if (!search) res.status(404);
    const supa = supabaseServerClient({ req, res });
    const { data: cities, error } = await findCity(search, supa)
    console.log({ cities, error })
    //const cities = filter(CITIES, search, { key: 'city', maxResults: 10 });
    res.status(error ? 500 : 200).json({ cities: cities ?? [] });
});