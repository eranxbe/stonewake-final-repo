import { test, expect } from '../../src/fixtures/test';
import { search } from '../../src/constants/data';
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
