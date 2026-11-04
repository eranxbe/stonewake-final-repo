import { test, expect } from '../../src/fixtures/test';

test('api 1 health', { tag: ['@api', '@smoke'] }, async ({ api }) => {
  const healthResponse = await api.health();
  expect(healthResponse.status()).toBe(200);

  const healthJson = await healthResponse.json();
  expect(Object.keys(healthJson).sort()).toEqual(['app', 'environment', 'status', 'version']);
  expect(healthJson.status).toBe('ok');
  expect(healthJson.app).toBe('stonewake');
  expect(typeof healthJson.version).toBe('string');
  expect(typeof healthJson.environment).toBe('string');
});
