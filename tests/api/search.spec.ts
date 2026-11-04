import { test, expect } from '../../src/fixtures/test';
import { search } from '../../src/constants/data';

test('api 10 search', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const searchResponse = await api.search({ q: search.bank, limit: 3 });
  expect(searchResponse.status()).toBe(200);

  const searchJson = await searchResponse.json();
  expect(searchJson.query).toBe(search.bank);
  expect(searchJson.hits.length).toBeGreaterThanOrEqual(1);
  expect(searchJson.hits.length).toBeLessThanOrEqual(3);

  for (const searchHit of searchJson.hits) {
    expect(typeof searchHit.node_id).toBe('number');
    expect(typeof searchHit.label).toBe('string');
    expect(searchHit.score).toBeGreaterThanOrEqual(0);
    expect(searchHit.score).toBeLessThanOrEqual(1);
  }

  expect((await (await api.search({ q: search.noApiHits })).json()).hits).toEqual([]);
  expect((await api.search()).status()).toBe(422);

  const queryTooShortResponse = await api.search({ q: search.tooShort });
  expect(queryTooShortResponse.status()).toBe(422);
  expect((await queryTooShortResponse.json()).detail[0].msg).toBe('String should have at least 2 characters');

  const limitTooLargeResponse = await api.search({ q: search.bank, limit: 99999 });
  expect(limitTooLargeResponse.status()).toBe(422);
  expect((await limitTooLargeResponse.json()).detail[0].msg).toBe('Input should be less than or equal to 25');
});
