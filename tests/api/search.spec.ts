import { test, expect } from '../../src/fixtures/test';
import { search } from '../../src/constants/data';

test('api 10 search', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const r = await api.search({ q: search.bank, limit: 3 });
  expect(r.status()).toBe(200);

  const b = await r.json();
  expect(b.query).toBe(search.bank);
  expect(b.hits.length).toBeGreaterThanOrEqual(1);
  expect(b.hits.length).toBeLessThanOrEqual(3);

  for (const h of b.hits) {
    expect(typeof h.node_id).toBe('number');
    expect(typeof h.label).toBe('string');
    expect(h.score).toBeGreaterThanOrEqual(0);
    expect(h.score).toBeLessThanOrEqual(1);
  }

  expect((await (await api.search({ q: search.noApiHits })).json()).hits).toEqual([]);
  expect((await api.search()).status()).toBe(422);

  const r4 = await api.search({ q: search.tooShort });
  expect(r4.status()).toBe(422);
  expect((await r4.json()).detail[0].msg).toBe('String should have at least 2 characters');

  const r5 = await api.search({ q: search.bank, limit: 99999 });
  expect(r5.status()).toBe(422);
  expect((await r5.json()).detail[0].msg).toBe('Input should be less than or equal to 25');
});
