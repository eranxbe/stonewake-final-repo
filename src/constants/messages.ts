export const titles = {
  signIn: 'Sign in · Stonewake',
  dealBook: 'Deal Book · Stonewake',
  institutions: 'Institutions · Stonewake',
  notFound: 'Page not found · Stonewake',
} as const;

export const headings = {
  signIn: 'Sign in',
  dealBook: 'Deal Book',
  countries: 'Countries',
  institutions: 'Institutions',
  portfolio: 'Portfolio',
  monitoring: 'Monitoring',
  screenings: 'Screenings',
  scoring: 'Scoring',
  briefing: 'Briefing',
  countryRisk: 'Country risk',
  dataSources: 'Data sources',
  financing: 'Financing',
  ownershipChain: 'Ownership chain',
} as const;

export const copy = {
  loginMismatch: 'That email and password do not match. Check both and try again.',
  noMatchingDeals: 'No matching deals',
  noMatchingCountries: 'No matching countries',
  nothingScreenedYet: 'Nothing screened yet',
  nothingMonitoredYet: 'Nothing monitored yet',
  termsOfService: 'Terms of Service',
  termsHref: 'https://stonewake.ai/terms',
  signOut: 'Sign out',
  dealsTab: 'Deals',
  team: 'Team',
  downloadReport: 'Download report',
  newScreening: 'New screening',
  monitorAName: 'Monitor a name',
} as const;

export const apiErrors = {
  unauthenticated: {
    error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' },
  },
  notFound: {
    error: { code: 'not_found', message: 'Resource not found.' },
  },
} as const;
