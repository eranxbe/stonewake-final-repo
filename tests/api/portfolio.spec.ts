import { test, expect } from '../../src/fixtures/test';
import { portfolioStatuses, summaryStatusKeys } from '../../src/constants/data';

test('api 5 portfolio list', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const portfolioListResponse = await api.portfolio({ limit: 2 });
  expect(portfolioListResponse.status()).toBe(200);

  const portfolioListJson = await portfolioListResponse.json();
  expect(Array.isArray(portfolioListJson.data)).not.toBe(true);
  expect(portfolioListJson.items.length).toBeLessThanOrEqual(2);
  expect(portfolioListJson.limit).toBe(2);
  expect(portfolioListJson.offset).toBe(0);
  expect(Number.isInteger(portfolioListJson.total)).toBe(true);

  for (const portfolioItem of portfolioListJson.items) {
    expect(typeof portfolioItem.id).toBe('number');
    expect(typeof portfolioItem.label).toBe('string');
    expect(typeof portfolioItem.active).toBe('boolean');
    expect(portfolioStatuses).toContain(portfolioItem.status);
    expect(portfolioItem.completeness).toBeGreaterThanOrEqual(0);
    expect(portfolioItem.completeness).toBeLessThanOrEqual(1);
  }

  const portfolioLimit100Response = await api.portfolio({ limit: 100 });
  expect(portfolioLimit100Response.status()).toBe(200);
  expect((await portfolioLimit100Response.json()).limit).toBe(100);

  expect((await api.portfolio({ limit: -1 })).status()).toBe(422);
  expect((await api.portfolio({ limit: 'abc' })).status()).toBe(422);

  const portfolioLimitTooLargeResponse = await api.portfolio({ limit: 100000 });
  expect(portfolioLimitTooLargeResponse.status()).toBe(422);
  expect((await portfolioLimitTooLargeResponse.json()).detail[0].msg).toBe('Input should be less than or equal to 100');
});

test('api 6 portfolio summary', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const summaryResponse = await api.portfolioSummary();
  expect(summaryResponse.status()).toBe(200);

  const portfolioSummaryJson = await summaryResponse.json();
  expect(Object.keys(portfolioSummaryJson.statuses).sort()).toEqual([...summaryStatusKeys]);

  let statusCountsTotal = 0;
  for (const statusKey in portfolioSummaryJson.statuses) {
    expect(Number.isInteger(portfolioSummaryJson.statuses[statusKey])).toBe(true);
    statusCountsTotal += portfolioSummaryJson.statuses[statusKey];
  }

  expect(Number.isInteger(portfolioSummaryJson.active_exposures)).toBe(true);
  expect(Number.isInteger(portfolioSummaryJson.reviews_overdue)).toBe(true);
  expect(statusCountsTotal).toBe(portfolioSummaryJson.active_exposures);

  const portfolioSinglePageResponse = await api.portfolio({ limit: 1 });
  expect((await portfolioSinglePageResponse.json()).total).toBe(portfolioSummaryJson.active_exposures);
});
