import { NextResponse } from 'next/server'
import { BLOCKED_COUNTRIES, REDIRECT_TO } from '../utils/blocked'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const country = req.geo?.country || 'US'

    if (BLOCKED_COUNTRIES.includes(country)) {
        return NextResponse.redirect(REDIRECT_TO)
    }

    return NextResponse.next()
}