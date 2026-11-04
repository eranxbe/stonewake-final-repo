import { test, expect } from '../../src/fixtures/test';

test('api 1 health', { tag: ['@api', '@smoke'] }, async ({ api }) => {
  const r = await api.health();
  expect(r.status()).toBe(200);

  const b = await r.json();
  expect(Object.keys(b).sort()).toEqual(['app', 'environment', 'status', 'version']);
  expect(b.status).toBe('ok');
  expect(b.app).toBe('stonewake');
  expect(typeof b.version).toBe('string');
  expect(typeof b.environment).toBe('string');
});
