import { test, expect } from '../../src/fixtures/test';
import { copy, headings } from '../../src/constants/messages';

test('ui 16 settings alerts keys audit members', { tag: ['@ui', '@regression'] }, async ({
  loggedInPage,
  settingsPage,
}) => {
  await settingsPage.open();
  await expect(settingsPage.heading).toHaveText(headings.settings);
  await expect(settingsPage.membersCard).toBeVisible();
  await expect(settingsPage.membersCard).toContainText(headings.members);
  await expect(settingsPage.emailAlertsCard).toBeVisible();

  const wasEnabled = await settingsPage.emailAlertsEnabled();
  await settingsPage.setEmailAlerts(true);
  await expect(settingsPage.emailSwitch).toHaveAttribute('aria-checked', 'true');
  await expect(settingsPage.emailSeverity).toBeEnabled();
  await expect(settingsPage.emailSave).toBeEnabled();
  await settingsPage.setEmailAlerts(wasEnabled);
  await expect(settingsPage.emailSwitch).toHaveAttribute(
    'aria-checked',
    wasEnabled ? 'true' : 'false',
  );

  const keyName = `pw-test-${Date.now()}`;
  await settingsPage.createApiKey(keyName);
  await expect(settingsPage.keyRow(keyName)).toBeVisible();
  await settingsPage.revokeApiKey(keyName);
  await expect(settingsPage.keyRow(keyName)).toContainText(copy.revoked);

  const audit = await settingsPage.downloadAuditCsv();
  expect(audit.suggestedFilename()).toMatch(/\.csv$/i);
});
