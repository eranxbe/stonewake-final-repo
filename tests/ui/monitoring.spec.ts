import { test, expect } from '../../src/fixtures/test';
import { copy, headings } from '../../src/constants/messages';
import { routes } from '../../src/constants/routes';

test('ui 12 monitoring entry points', { tag: ['@ui', '@regression'] }, async ({
  loggedInPage,
  monitoringPage,
}) => {
  await monitoringPage.open();
  await expect(monitoringPage.heading).toHaveText(headings.monitoring);
  await expect(monitoringPage.monitorAName).toBeVisible();
  await expect(monitoringPage.emptyState).toHaveText(copy.nothingMonitoredYet);

  await monitoringPage.portfolioLink.click();
  await loggedInPage.waitForURL(`**${routes.portfolio}`);
  await expect(loggedInPage.locator('h1')).toHaveText(headings.portfolio);
});
