import type { NextApiRequest, NextApiResponse } from 'next';
import { findCity } from '../../utils/supabase';

interface City {
    id?: number;
    city: string;
    district: string;
    region: string;
}

type Data = {
    cities: City[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const search = req.query.search as string;
    if (!search) res.status(404);
    const { data: cities, error } = await findCity(search)
    console.log({ cities, error })
    //const cities = filter(CITIES, search, { key: 'city', maxResults: 10 });
    res.status(error ? 500 : 200).json({ cities: cities ?? [] });
}
