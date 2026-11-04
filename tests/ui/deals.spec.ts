import { test, expect } from '../../src/fixtures/test';
import { dealFilters, search } from '../../src/constants/data';
import { copy } from '../../src/constants/messages';

test('ui 7 deal book search', { tag: ['@ui', '@regression'] }, async ({ loggedInPage, dealBookPage }) => {
  await expect(dealBookPage.sectorSelect).toBeVisible();
  await expect(dealBookPage.selectedTab).toHaveText(copy.dealsTab);

  const firstDealLink = dealBookPage.firstDeal();
  await expect(firstDealLink).toBeVisible();
  const dealHref = await firstDealLink.getAttribute('href');
  expect(dealHref).toBeTruthy();

  await dealBookPage.searchDeals(search.noDeals);
  await expect(dealBookPage.noMatches).toBeVisible();

  await dealBookPage.clearSearch();
  await dealBookPage.openDeal(dealHref!);
  await expect(dealBookPage.briefing).toBeVisible();
});

test('ui 14 deal book filter sources export', { tag: ['@ui', '@regression'] }, async ({
  loggedInPage,
  dealBookPage,
}) => {
  await dealBookPage.open();
  await expect(dealBookPage.windowSelect).toBeVisible();
  await expect(dealBookPage.regionSelect).toBeVisible();

  await dealBookPage.filterBySector(dealFilters.sector);
  const filteredDeal = dealBookPage.firstDeal();
  await expect(filteredDeal).toBeVisible();
  await expect(filteredDeal).toContainText(/Energy|power/i);

  const dealHref = await filteredDeal.getAttribute('href');
  expect(dealHref).toBeTruthy();

  await dealBookPage.openDeal(dealHref!);
  await expect(dealBookPage.briefing).toBeVisible();
  await expect(dealBookPage.sourceLinks.first()).toBeVisible();
  await expect(dealBookPage.downloadReport).toBeVisible();

  const download = await dealBookPage.downloadDealReport();
  expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
});

test('ui 19 deal book excel and deck export', { tag: ['@ui', '@regression'] }, async ({
  loggedInPage,
  dealBookPage,
}) => {
  await dealBookPage.open();
  const workbook = await dealBookPage.exportWorkbook();
  expect(workbook.suggestedFilename()).toMatch(/\.xlsx$/i);

  const dealHref = await dealBookPage.firstDeal().getAttribute('href');
  expect(dealHref).toBeTruthy();
  await dealBookPage.openDeal(dealHref!);
  await expect(dealBookPage.downloadDeck).toBeVisible();
  const deck = await dealBookPage.downloadDealDeck();
  expect(deck.suggestedFilename()).toMatch(/\.pptx$/i);
});
