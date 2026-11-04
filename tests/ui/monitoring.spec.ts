import { test, expect } from '../../src/fixtures/test';
import { monitoringTarget } from '../../src/constants/data';
import { headings } from '../../src/constants/messages';
import { routes } from '../../src/constants/routes';

test('ui 12 monitoring entry points', { tag: ['@ui', '@regression'] }, async ({
  loggedInPage,
  monitoringPage,
}) => {
  await monitoringPage.open();
  await expect(monitoringPage.heading).toHaveText(headings.monitoring);
  await expect(monitoringPage.monitorAName).toBeVisible();
  await expect(monitoringPage.portfolioLink).toBeVisible();

  await monitoringPage.portfolioLink.click();
  await loggedInPage.waitForURL(`**${routes.portfolio}`);
  await expect(loggedInPage.locator('h1')).toHaveText(headings.portfolio);
});

test('ui 17 monitoring frequency pause resume', { tag: ['@ui', '@regression'] }, async ({
  loggedInPage,
  monitoringPage,
}) => {
  await monitoringPage.open();
  const { query, suggestion, rowName } = monitoringTarget;

  await monitoringPage.addName(query, suggestion, rowName);
  await expect(monitoringPage.targetRow(rowName)).toBeVisible();
  await expect(monitoringPage.activeSwitch(rowName)).toHaveAttribute('aria-checked', 'true');

  await monitoringPage.setFrequency(rowName, 'Weekly');
  await expect(monitoringPage.frequencySelect(rowName)).toHaveValue('604800');

  await monitoringPage.setActive(rowName, false);
  await expect(monitoringPage.activeSwitch(rowName)).toHaveAttribute('aria-checked', 'false');

  await monitoringPage.setActive(rowName, true);
  await expect(monitoringPage.activeSwitch(rowName)).toHaveAttribute('aria-checked', 'true');

  await monitoringPage.removeTarget(rowName);
  await expect(monitoringPage.emptyState).toBeVisible();
});
