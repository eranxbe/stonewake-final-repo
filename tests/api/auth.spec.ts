import { test, expect } from '../../src/fixtures/test';
import { credentials } from '../../src/constants/data';
import { apiErrors } from '../../src/constants/messages';

test('api 2 me', { tag: ['@api', '@smoke'] }, async ({ api }) => {
  const meResponse = await api.me();
  expect(meResponse.status()).toBe(200);

  const meJson = await meResponse.json();
  expect(meJson.credential).toBe('api_key');
  expect(typeof meJson.role).toBe('string');
  expect(meJson.role).toMatch(/^[a-z_]+$/);
  expect(typeof meJson.team_scope.all_teams).toBe('boolean');
  expect(Array.isArray(meJson.team_scope.teams)).toBe(true);

  if (!meJson.team_scope.all_teams) {
    expect(meJson.team_scope.teams.length).toBeGreaterThan(0);
    for (const team of meJson.team_scope.teams) {
      expect(typeof team.id).toBe('string');
      expect(typeof team.name).toBe('string');
    }
  }

  expect(meResponse.headers()['x-ratelimit-limit']).toMatch(/^\d+$/);
  expect(meResponse.headers()['x-ratelimit-remaining']).toMatch(/^\d+$/);
});

test('api 3 no token', { tag: ['@api', '@smoke'] }, async ({ api }) => {
  const unauthenticatedResponses = [
    await api.me('none'),
    await api.portfolio(undefined, 'none'),
    await api.countries('none'),
    await api.entities(undefined, 'none'),
    await api.citationsResolve('none'),
  ];

  for (const response of unauthenticatedResponses) {
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual(apiErrors.unauthenticated);
  }
});

test('api 4 bad keys', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const invalidBearerMeResponse = await api.me({ bearer: credentials.invalidApiKey });
  expect(invalidBearerMeResponse.status()).toBe(401);
  expect(await invalidBearerMeResponse.json()).toEqual(apiErrors.unauthenticated);

  const notAKeyMeResponse = await api.me({ bearer: credentials.notAKey });
  expect(notAKeyMeResponse.status()).toBe(401);
  expect(await notAKeyMeResponse.json()).toEqual(apiErrors.unauthenticated);

  const basicAuthMeResponse = await api.me({ authorization: credentials.basicAuth });
  expect(basicAuthMeResponse.status()).toBe(401);
  expect(await basicAuthMeResponse.json()).toEqual(apiErrors.unauthenticated);

  const invalidBearerPortfolioResponse = await api.portfolio(undefined, { bearer: credentials.invalidApiKey });
  expect(invalidBearerPortfolioResponse.status()).toBe(401);
});
