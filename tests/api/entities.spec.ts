import { test, expect } from '../../src/fixtures/test';
import { apiErrors } from '../../src/constants/messages';

test('api 7 entities', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const r = await api.entities({ limit: 2 });
  expect(r.status()).toBe(200);

  const b = await r.json();
  expect(Array.isArray(b.items)).toBe(true);
  expect(b.items.length).toBeGreaterThanOrEqual(1);
  expect(b.limit).toBe(2);
  expect(b.total).toBeGreaterThan(0);

  for (const i of b.items) {
    expect(typeof i.id).toBe('number');
    expect(typeof i.slug).toBe('string');
    expect(typeof i.display_name).toBe('string');
    expect(typeof i.kind).toBe('string');
  }

  const first = b.items[0];
  const r2 = await api.entity(first.id);
  expect(r2.status()).toBe(200);
  expect(await r2.json()).toEqual(first);
});

test('api 8 entity not found', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const r = await api.entity(999999);
  expect(r.status()).toBe(404);
  expect(await r.json()).toEqual(apiErrors.notFound);

  const r2 = await api.entity('abc');
  expect(r2.status()).toBe(422);
  const b2 = await r2.json();
  expect(b2.error.code).toBe('validation_failed');
  expect(b2.detail[0].type).toBe('int_parsing');
  expect(b2.detail[0].loc).toEqual(['path', 'entity_id']);

  expect((await api.node(999999999)).status()).toBe(404);
  expect((await api.entity(999999, 'none')).status()).toBe(401);
});
