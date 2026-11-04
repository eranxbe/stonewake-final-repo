import { test, expect } from '../../src/fixtures/test';
import { headings } from '../../src/constants/messages';

test('ui 15 tenders dismiss and add to deal book', { tag: ['@ui', '@regression'] }, async ({
  loggedInPage,
  tendersPage,
}) => {
  await tendersPage.open();
  await expect(tendersPage.heading).toHaveText(headings.tenders);
  await expect(tendersPage.matchesTab).toBeVisible();
  await expect(tendersPage.profilesTab).toBeVisible();
  await expect(tendersPage.matchCount).toBeVisible();

  await tendersPage.filterNew();
  await expect(tendersPage.matchCards.first()).toBeVisible();
  await expect(tendersPage.matchCards.nth(1)).toBeVisible();

  const dismissMatch = tendersPage.matchCards.nth(0);
  const addMatch = tendersPage.matchCards.nth(1);
  await tendersPage.openWhy(dismissMatch);
  await expect(tendersPage.noticeLink(dismissMatch)).toBeVisible();

  const dismissedTitle = (await tendersPage.matchTitle(dismissMatch)).trim();
  const addedTitle = (await tendersPage.matchTitle(addMatch)).trim();
  expect(dismissedTitle.length).toBeGreaterThan(0);
  expect(addedTitle.length).toBeGreaterThan(0);
  expect(addedTitle).not.toBe(dismissedTitle);

  await tendersPage.dismiss(dismissMatch);
  await tendersPage.filterDismissed();
  await expect(tendersPage.matches).toContainText(dismissedTitle);

  await tendersPage.filterNew();
  const stillNew = tendersPage.matchCards.filter({ hasText: addedTitle }).first();
  await expect(stillNew.getByTestId('tender-take')).toBeVisible();
  await tendersPage.addToDealBook(stillNew);

  await tendersPage.filterInDealBook();
  await expect(tendersPage.matchCards.filter({ hasText: addedTitle }).first()).toBeVisible();
  await expect(
    tendersPage.matchCards.filter({ hasText: addedTitle }).first().getByTestId('tender-take'),
  ).toHaveCount(0);
  await expect(
    tendersPage.matchCards.filter({ hasText: addedTitle }).first().getByRole('link', { name: 'Open deal', exact: true }),
  ).toBeVisible();
});
