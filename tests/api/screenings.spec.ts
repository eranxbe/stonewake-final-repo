import { test, expect } from '../../src/fixtures/test';
import { apiErrors } from '../../src/constants/messages';

test('api 13 screenings list', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const screeningsResponse = await api.screenings({ limit: 5 });
  expect(screeningsResponse.status()).toBe(200);

  const screeningsJson = await screeningsResponse.json();
  expect(Array.isArray(screeningsJson.items)).toBe(true);
  expect(screeningsJson.limit).toBe(5);
  expect(screeningsJson.offset).toBe(0);
  expect(Number.isInteger(screeningsJson.total)).toBe(true);

  for (const screening of screeningsJson.items) {
    expect(typeof screening.screening_id === 'number' || typeof screening.id === 'number').toBe(true);
    expect(typeof screening.subject === 'string' || typeof screening.subject_name === 'string').toBe(true);
  }

  if (screeningsJson.items.length > 0) {
    const screeningId = screeningsJson.items[0].screening_id ?? screeningsJson.items[0].id;
    const screeningDetailResponse = await api.screening(screeningId);
    expect(screeningDetailResponse.status()).toBe(200);

    const screeningDetailJson = await screeningDetailResponse.json();
    expect(Array.isArray(screeningDetailJson.sources) || Array.isArray(screeningDetailJson.findings)).toBe(true);
  }

  expect((await api.screenings(undefined, 'none')).status()).toBe(401);
  expect(await (await api.screenings(undefined, 'none')).json()).toEqual(apiErrors.unauthenticated);
  expect((await api.screening(999999999)).status()).toBe(404);
});
