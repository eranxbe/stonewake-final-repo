export const routes = {
  home: '/',
  login: '/login',
  portfolio: '/portfolio',
  countries: '/countries',
  country: (iso3: string) => `/countries/${iso3}`,
  entities: '/entities',
  entity: (id: string | number) => `/entities/${id}`,
  monitoring: '/monitoring',
  screenings: '/screenings',
  scoring: '/scoring',
} as const;

export const apiRoutes = {
  health: '/health',
  me: '/v1/me',
  portfolio: '/v1/portfolio',
  portfolioSummary: '/v1/portfolio/summary',
  entities: '/v1/entities',
  entity: (id: string | number) => `/v1/entities/${id}`,
  nodes: (id: string | number) => `/v1/nodes/${id}`,
  countries: '/v1/countries',
  country: (iso3: string) => `/v1/countries/${iso3}`,
  search: '/v1/search',
  citationsResolve: '/v1/citations/resolve',
} as const;
