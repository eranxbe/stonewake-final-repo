export const credentials = {
  wrongPassword: 'definitely-wrong-password-123',
  invalidApiKey: 'swk_live_invalid000000000000000000000000',
  notAKey: 'not-a-key',
  basicAuth: 'Basic abc',
} as const;

export const search = {
  noDeals: 'zzzzqqxx',
  noCountries: 'Zzzzqq',
  noApiHits: 'zzzzqqqxxxyy',
  bank: 'bank',
  tooShort: 'a',
} as const;

export const country = {
  name: 'Germany',
  iso3: 'DEU',
  iso2: 'DE',
  region: 'europe',
  invalidIso3: 'ZZZ',
} as const;

export const institution = {
  query: 'UKEF',
  name: 'UK Export Finance',
  id: 4,
} as const;

export const portfolioStatuses = [
  'green',
  'amber',
  'red',
  'insufficient',
  'not_assessed',
  'sole_trader',
] as const;

export const summaryStatusKeys = [
  'amber',
  'green',
  'insufficient',
  'not_assessed',
  'red',
  'sole_trader',
] as const;
