import { test, expect } from '../../src/fixtures/test';
import { tenderMatchStatuses } from '../../src/constants/data';
import { apiErrors } from '../../src/constants/messages';

test('api 16 tender profiles and matches', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const profilesResponse = await api.tenderProfiles();
  expect(profilesResponse.status()).toBe(200);

  const profilesJson = await profilesResponse.json();
  expect(Array.isArray(profilesJson.items)).toBe(true);
  expect(profilesJson.items.length).toBeGreaterThanOrEqual(1);

  for (const profile of profilesJson.items.slice(0, 3)) {
    expect(typeof profile.id).toBe('number');
    expect(typeof profile.name).toBe('string');
    expect(typeof profile.active).toBe('boolean');
    expect(Array.isArray(profile.cpv_codes) || profile.cpv_codes === null).toBe(true);
  }

  const matchesResponse = await api.tenderMatches({ limit: 3, status: 'new' });
  expect(matchesResponse.status()).toBe(200);

  const matchesJson = await matchesResponse.json();
  expect(Array.isArray(matchesJson.items)).toBe(true);
  expect(matchesJson.items.length).toBeGreaterThanOrEqual(1);
  expect(matchesJson.items.length).toBeLessThanOrEqual(3);

  for (const match of matchesJson.items) {
    expect(typeof match.id).toBe('number');
    expect(tenderMatchStatuses).toContain(match.status);
    expect(Array.isArray(match.reasons)).toBe(true);
    expect(match.notice || match.portal_notice).toBeTruthy();
  }

  const matchId = matchesJson.items[0].id;
  const detailResponse = await api.tenderMatch(matchId);
  expect(detailResponse.status()).toBe(200);
  expect((await detailResponse.json()).id).toBe(matchId);

  expect((await api.tenderMatch(999999999)).status()).toBe(404);
  expect((await api.tenderProfiles(undefined, 'none')).status()).toBe(401);
  expect(await (await api.tenderMatches(undefined, 'none')).json()).toEqual(apiErrors.unauthenticated);
});
