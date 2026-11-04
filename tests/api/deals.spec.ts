import { test, expect } from '../../src/fixtures/test';
import { dealFilters, search } from '../../src/constants/data';

test('api 11 deals list and filter', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const dealsListResponse = await api.deals({ limit: 2 });
  expect(dealsListResponse.status()).toBe(200);

  const dealsListJson = await dealsListResponse.json();
  expect(Array.isArray(dealsListJson.items)).toBe(true);
  expect(dealsListJson.items.length).toBeGreaterThanOrEqual(1);
  expect(dealsListJson.items.length).toBeLessThanOrEqual(2);
  expect(Number.isInteger(dealsListJson.total)).toBe(true);

  for (const deal of dealsListJson.items) {
    expect(typeof deal.deal_id).toBe('string');
    expect(typeof deal.name).toBe('string');
    expect(typeof deal.sector).toBe('string');
  }

  const filteredResponse = await api.deals({
    limit: 5,
    sector: dealFilters.sector,
    country_code: dealFilters.countryCode,
  });
  expect(filteredResponse.status()).toBe(200);

  const filteredJson = await filteredResponse.json();
  expect(filteredJson.items.length).toBeGreaterThanOrEqual(1);
  for (const deal of filteredJson.items) {
    expect(deal.sector).toBe(dealFilters.sector);
    expect(deal.countries_iso3).toContain(dealFilters.countryCode);
  }

  const noHitsResponse = await api.deals({ q: search.noDeals, limit: 5 });
  expect(noHitsResponse.status()).toBe(200);
  expect((await noHitsResponse.json()).items).toEqual([]);

  expect((await api.deals({ country_code: dealFilters.invalidCountryCode })).status()).toBe(422);
  expect((await api.deals(undefined, 'none')).status()).toBe(401);
});

test('api 12 deal detail sources and export', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const dealsListJson = await (await api.deals({ limit: 1 })).json();
  const dealId = dealsListJson.items[0].deal_id;

  const dealDetailResponse = await api.deal(dealId);
  expect(dealDetailResponse.status()).toBe(200);

  const dealDetailJson = await dealDetailResponse.json();
  expect(dealDetailJson.deal_id).toBe(dealId);
  expect(typeof dealDetailJson.name).toBe('string');
  expect(Array.isArray(dealDetailJson.summary_lines)).toBe(true);
  expect(dealDetailJson.summary_lines.length).toBeGreaterThanOrEqual(1);
  expect(Array.isArray(dealDetailJson.sources)).toBe(true);
  expect(dealDetailJson.sources.length).toBeGreaterThanOrEqual(1);

  for (const source of dealDetailJson.sources) {
    expect(typeof source.source_id).toBe('string');
    expect(typeof source.url).toBe('string');
  }

  if (dealDetailJson.briefing) {
    expect(typeof dealDetailJson.briefing.text).toBe('string');
    expect(Array.isArray(dealDetailJson.briefing.sources)).toBe(true);
  }

  const reportResponse = await api.dealReportPdf(dealId);
  expect(reportResponse.status()).toBe(200);
  expect(reportResponse.headers()['content-type']).toContain('application/pdf');
  expect((await reportResponse.body()).byteLength).toBeGreaterThan(1000);

  expect((await api.deal('does-not-exist-deal')).status()).toBe(404);
});
