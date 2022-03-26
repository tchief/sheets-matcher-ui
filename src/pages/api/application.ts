import type { NextApiRequest, NextApiResponse } from 'next';
import { Application } from '../../types';
import { saveApplication } from '../../utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const application = { ...req.body } as Application;
    const { error } = await saveApplication(application);
    console.log({ error });
    res.status(error ? 500 : 200).end();
}
