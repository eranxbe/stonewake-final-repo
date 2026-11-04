import { test, expect } from '../../src/fixtures/test';
import { headings } from '../../src/constants/messages';

test('ui 10 portfolio', { tag: ['@ui', '@regression'] }, async ({ loggedInPage, portfolioPage }) => {
  await portfolioPage.open();
  await expect(portfolioPage.heading).toHaveText(headings.portfolio);
  await expect(portfolioPage.tileRed).toBeVisible();
  await expect(portfolioPage.tileAmber).toBeVisible();
  await expect(portfolioPage.tileGreen).toBeVisible();
  await expect(portfolioPage.tileInsufficient).toBeVisible();
  await expect(portfolioPage.tileNotAssessed).toBeVisible();

  await expect(portfolioPage.firstEntity()).toBeVisible();
  const name = await portfolioPage.openFirstEntity();
  await expect(loggedInPage.locator('h1')).toHaveText(name);
});
