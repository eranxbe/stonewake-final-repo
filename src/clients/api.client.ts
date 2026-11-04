import type { APIRequestContext, APIResponse } from '@playwright/test';
import { API_KEY } from '../constants/env';
import { apiRoutes } from '../constants/routes';

type AuthMode = 'default' | 'none' | { bearer?: string; authorization?: string };

type RequestOpts = {
  auth?: AuthMode;
  params?: Record<string, string | number | undefined>;
};

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  health(): Promise<APIResponse> {
    return this.get(apiRoutes.health, { auth: 'none' });
  }

  me(auth?: AuthMode): Promise<APIResponse> {
    return this.get(apiRoutes.me, { auth });
  }

  portfolio(params?: Record<string, string | number | undefined>, auth?: AuthMode): Promise<APIResponse> {
    return this.get(apiRoutes.portfolio, { params, auth });
  }

  portfolioSummary(auth?: AuthMode): Promise<APIResponse> {
    return this.get(apiRoutes.portfolioSummary, { auth });
  }

  entities(params?: Record<string, string | number | undefined>, auth?: AuthMode): Promise<APIResponse> {
    return this.get(apiRoutes.entities, { params, auth });
  }

  entity(id: string | number, auth?: AuthMode): Promise<APIResponse> {
    return this.get(apiRoutes.entity(id), { auth });
  }

  node(id: string | number, auth?: AuthMode): Promise<APIResponse> {
    return this.get(apiRoutes.nodes(id), { auth });
  }

  countries(auth?: AuthMode): Promise<APIResponse> {
    return this.get(apiRoutes.countries, { auth });
  }

  country(iso3: string, auth?: AuthMode): Promise<APIResponse> {
    return this.get(apiRoutes.country(iso3), { auth });
  }

  search(params?: Record<string, string | number | undefined>, auth?: AuthMode): Promise<APIResponse> {
    return this.get(apiRoutes.search, { params, auth });
  }

  citationsResolve(auth?: AuthMode): Promise<APIResponse> {
    return this.post(apiRoutes.citationsResolve, { auth });
  }

  get(path: string, opts: RequestOpts = {}): Promise<APIResponse> {
    return this.request.get(this.withParams(path, opts.params), {
      headers: this.headers(opts.auth),
    });
  }

  post(path: string, opts: RequestOpts = {}): Promise<APIResponse> {
    return this.request.post(this.withParams(path, opts.params), {
      headers: this.headers(opts.auth),
    });
  }

  private headers(auth: AuthMode = 'default'): Record<string, string> | undefined {
    if (auth === 'none') return undefined;
    if (auth === 'default') return { Authorization: `Bearer ${API_KEY}` };
    if (auth.authorization) return { Authorization: auth.authorization };
    if (auth.bearer) return { Authorization: `Bearer ${auth.bearer}` };
    return undefined;
  }

  private withParams(path: string, params?: Record<string, string | number | undefined>): string {
    if (!params) return path;
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) query.set(key, String(value));
    }
    const qs = query.toString();
    return qs ? `${path}?${qs}` : path;
  }
}
