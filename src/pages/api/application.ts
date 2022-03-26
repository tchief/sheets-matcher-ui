import type { NextApiRequest, NextApiResponse } from 'next';
import { Application } from '../../types';
import { saveApplication } from '../../utils/supabase';
import {
    withAuthRequired,
    supabaseServerClient
} from '@supabase/supabase-auth-helpers/nextjs';

export default withAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse) {
    const application = { ...req.body } as Application;
    const supa = supabaseServerClient({ req, res });
    const { error } = await saveApplication(application, supa);
    console.log({ error });
    res.status(error ? 500 : 200).end();
});