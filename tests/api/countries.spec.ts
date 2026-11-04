import { test, expect } from '../../src/fixtures/test';
import { country } from '../../src/constants/data';

test('api 9 countries', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const countriesListResponse = await api.countries();
  expect(countriesListResponse.status()).toBe(200);

  const countriesListJson = await countriesListResponse.json();
  expect(Array.isArray(countriesListJson.regions)).toBe(true);
  expect(countriesListJson.countries.length).toBeGreaterThanOrEqual(100);

  for (const countryRow of countriesListJson.countries) {
    expect(countryRow.iso3).toMatch(/^[A-Z]{3}$/);
    expect(typeof countryRow.name).toBe('string');
  }

  const germanyFromList = countriesListJson.countries.find((countryRow: { iso3: string }) => countryRow.iso3 === country.iso3);
  expect(germanyFromList.name).toBe(country.name);

  const countryDetailResponse = await api.country(country.iso3);
  expect(countryDetailResponse.status()).toBe(200);
  const countryDetailJson = await countryDetailResponse.json();
  expect(countryDetailJson.iso3).toBe(country.iso3);
  expect(countryDetailJson.iso2).toBe(country.iso2);
  expect(countryDetailJson.name).toBe(country.name);
  expect(countryDetailJson.region).toBe(country.region);
  expect(countryDetailJson.risk.score).toBeGreaterThanOrEqual(0);
  expect(countryDetailJson.risk.score).toBeLessThanOrEqual(100);

  expect((await api.country(country.invalidIso3)).status()).toBe(404);
});
