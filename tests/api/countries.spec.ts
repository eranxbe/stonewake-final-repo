import { test, expect } from '../../src/fixtures/test';
import { country } from '../../src/constants/data';

test('api 9 countries', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const r = await api.countries();
  expect(r.status()).toBe(200);

  const b = await r.json();
  expect(Array.isArray(b.regions)).toBe(true);
  expect(b.countries.length).toBeGreaterThanOrEqual(100);

  for (const c of b.countries) {
    expect(c.iso3).toMatch(/^[A-Z]{3}$/);
    expect(typeof c.name).toBe('string');
  }

  const de = b.countries.find((x: { iso3: string }) => x.iso3 === country.iso3);
  expect(de.name).toBe(country.name);

  const r2 = await api.country(country.iso3);
  expect(r2.status()).toBe(200);
  const d = await r2.json();
  expect(d.iso3).toBe(country.iso3);
  expect(d.iso2).toBe(country.iso2);
  expect(d.name).toBe(country.name);
  expect(d.region).toBe(country.region);
  expect(d.risk.score).toBeGreaterThanOrEqual(0);
  expect(d.risk.score).toBeLessThanOrEqual(100);

  expect((await api.country(country.invalidIso3)).status()).toBe(404);
});
