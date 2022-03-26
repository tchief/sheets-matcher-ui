import { NextResponse } from 'next/server'
import { BLOCKED_COUNTRIES, BLOCKED_IPS, REDIRECT_TO } from '../utils/blocked'
import type { NextRequest } from 'next/server';
import isbot from 'isbot';

export function middleware(req: NextRequest) {
    const country = req.geo?.country || 'US';
    const isBot = !req.ua?.ua.includes('https://vercel.com') && (!!req.ua?.isBot || isbot(req.ua?.ua));
    const ip = req.ip || '127.0.0.1';

    if (BLOCKED_COUNTRIES.includes(country) || isBot || BLOCKED_IPS.includes(ip)) {
        return NextResponse.redirect(REDIRECT_TO)
    }

    return NextResponse.next()
}