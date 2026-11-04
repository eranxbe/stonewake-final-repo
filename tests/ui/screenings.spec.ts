import { test, expect } from '../../src/fixtures/test';
import { copy, headings } from '../../src/constants/messages';

test('ui 11 screenings empty state', { tag: ['@ui', '@regression'] }, async ({ loggedInPage, screeningsPage }) => {
  await screeningsPage.open();
  await expect(screeningsPage.heading).toHaveText(headings.screenings);
  await expect(screeningsPage.newScreening).toBeVisible();
  await expect(screeningsPage.emptyState).toHaveText(copy.nothingScreenedYet);
});
