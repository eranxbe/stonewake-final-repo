export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} in .env`);
  return value;
}

export const APP_URL = requireEnv('STONEWAKE_APP_URL');
export const API_URL = requireEnv('STONEWAKE_API_URL');
export const EMAIL = requireEnv('STONEWAKE_EMAIL');
export const PASSWORD = requireEnv('STONEWAKE_PASSWORD');
export const API_KEY = requireEnv('STONEWAKE_API_KEY');
