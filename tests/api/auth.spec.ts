import { test, expect } from '../../src/fixtures/test';
import { credentials } from '../../src/constants/data';
import { apiErrors } from '../../src/constants/messages';

test('api 2 me', { tag: ['@api', '@smoke'] }, async ({ api }) => {
  const r = await api.me();
  expect(r.status()).toBe(200);

  const b = await r.json();
  expect(b.credential).toBe('api_key');
  expect(typeof b.role).toBe('string');
  expect(b.role).toMatch(/^[a-z_]+$/);
  expect(typeof b.team_scope.all_teams).toBe('boolean');
  expect(Array.isArray(b.team_scope.teams)).toBe(true);

  if (!b.team_scope.all_teams) {
    expect(b.team_scope.teams.length).toBeGreaterThan(0);
    for (const t of b.team_scope.teams) {
      expect(typeof t.id).toBe('string');
      expect(typeof t.name).toBe('string');
    }
  }

  expect(r.headers()['x-ratelimit-limit']).toMatch(/^\d+$/);
  expect(r.headers()['x-ratelimit-remaining']).toMatch(/^\d+$/);
});

test('api 3 no token', { tag: ['@api', '@smoke'] }, async ({ api }) => {
  const checks = [
    await api.me('none'),
    await api.portfolio(undefined, 'none'),
    await api.countries('none'),
    await api.entities(undefined, 'none'),
    await api.citationsResolve('none'),
  ];

  for (const r of checks) {
    expect(r.status()).toBe(401);
    expect(await r.json()).toEqual(apiErrors.unauthenticated);
  }
});

test('api 4 bad keys', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const r = await api.me({ bearer: credentials.invalidApiKey });
  expect(r.status()).toBe(401);
  expect(await r.json()).toEqual(apiErrors.unauthenticated);

  const r2 = await api.me({ bearer: credentials.notAKey });
  expect(r2.status()).toBe(401);
  expect(await r2.json()).toEqual(apiErrors.unauthenticated);

  const r3 = await api.me({ authorization: credentials.basicAuth });
  expect(r3.status()).toBe(401);
  expect(await r3.json()).toEqual(apiErrors.unauthenticated);

  const r4 = await api.portfolio(undefined, { bearer: credentials.invalidApiKey });
  expect(r4.status()).toBe(401);
});
