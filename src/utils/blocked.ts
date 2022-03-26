export const BLOCKED_COUNTRIES = process.env.BLOCKED_COUNTRIES?.split(',') ?? [];
export const REDIRECT_TO = process.env.REDIRECT_BLOCKED_COUNTRY_TO ?? '/404';
