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

export const company = {
  nodeId: 106084,
  name: 'ROLLS-ROYCE HOLDINGS PLC',
  countryIso3: 'GBR',
} as const;

export const dealFilters = {
  sector: 'energy_power',
  countryCode: 'USA',
  invalidCountryCode: 'zzz',
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

export const tenderMatchStatuses = ['new', 'dismissed', 'in_deal_book'] as const;

export const alertSeverities = ['critical', 'high', 'info'] as const;

export const alertChannels = ['email', 'sms', 'teams', 'webhook', 'in_app'] as const;

export const workspaceName = 'ITAC 1' as const;

export const monitoringTarget = {
  query: 'Siemens',
  suggestion: 'Siemens Aktiengesellschaft',
  rowName: 'Siemens',
} as const;

export const institutionEntityId = 4 as const;
