import { test, expect } from '../../src/fixtures/test';
import { portfolioStatuses, summaryStatusKeys } from '../../src/constants/data';

test('api 5 portfolio list', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const r = await api.portfolio({ limit: 2 });
  expect(r.status()).toBe(200);

  const b = await r.json();
  expect(Array.isArray(b.data)).not.toBe(true);
  expect(b.items.length).toBeLessThanOrEqual(2);
  expect(b.limit).toBe(2);
  expect(b.offset).toBe(0);
  expect(Number.isInteger(b.total)).toBe(true);

  for (const i of b.items) {
    expect(typeof i.id).toBe('number');
    expect(typeof i.label).toBe('string');
    expect(typeof i.active).toBe('boolean');
    expect(portfolioStatuses).toContain(i.status);
    expect(i.completeness).toBeGreaterThanOrEqual(0);
    expect(i.completeness).toBeLessThanOrEqual(1);
  }

  const r2 = await api.portfolio({ limit: 100 });
  expect(r2.status()).toBe(200);
  expect((await r2.json()).limit).toBe(100);

  expect((await api.portfolio({ limit: -1 })).status()).toBe(422);
  expect((await api.portfolio({ limit: 'abc' })).status()).toBe(422);

  const r5 = await api.portfolio({ limit: 100000 });
  expect(r5.status()).toBe(422);
  expect((await r5.json()).detail[0].msg).toBe('Input should be less than or equal to 100');
});

test('api 6 portfolio summary', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const r = await api.portfolioSummary();
  expect(r.status()).toBe(200);

  const s = await r.json();
  expect(Object.keys(s.statuses).sort()).toEqual([...summaryStatusKeys]);

  let sum = 0;
  for (const k in s.statuses) {
    expect(Number.isInteger(s.statuses[k])).toBe(true);
    sum += s.statuses[k];
  }

  expect(Number.isInteger(s.active_exposures)).toBe(true);
  expect(Number.isInteger(s.reviews_overdue)).toBe(true);
  expect(sum).toBe(s.active_exposures);

  const r2 = await api.portfolio({ limit: 1 });
  expect((await r2.json()).total).toBe(s.active_exposures);
});
