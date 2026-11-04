import { test, expect } from '../../src/fixtures/test';
import { copy, headings } from '../../src/constants/messages';

test('ui 10 portfolio', { tag: ['@ui', '@regression'] }, async ({ loggedInPage, portfolioPage }) => {
  await portfolioPage.open();
  await expect(portfolioPage.heading).toHaveText(headings.portfolio);
  await expect(portfolioPage.tileRed).toBeVisible();
  await expect(portfolioPage.tileAmber).toBeVisible();
  await expect(portfolioPage.tileGreen).toBeVisible();
  await expect(portfolioPage.tileInsufficient).toBeVisible();
  await expect(portfolioPage.tileNotAssessed).toBeVisible();

  await expect(portfolioPage.firstEntity()).toBeVisible();
  const entityDisplayName = await portfolioPage.openFirstEntity();
  await expect(loggedInPage.locator('h1')).toHaveText(entityDisplayName);
});

test('ui 18 portfolio status changes', { tag: ['@ui', '@regression'] }, async ({
  loggedInPage,
  portfolioPage,
}) => {
  await portfolioPage.open();
  await expect(portfolioPage.transitionsFeed).toBeVisible();
  await expect(portfolioPage.statusChangesHeading()).toBeVisible();
  await expect(portfolioPage.acknowledgeAll).toContainText(copy.acknowledgeAll);

  const pending = portfolioPage.acknowledgeButtons();
  const count = await pending.count();
  if (count > 0) {
    await portfolioPage.acknowledgeFirstChange();
    await expect(pending).toHaveCount(count - 1);
  }
});
