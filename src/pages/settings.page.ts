import type { Download, Locator, Page } from '@playwright/test';
import { copy, headings } from '../constants/messages';
import { routes } from '../constants/routes';

export class SettingsPage {
  readonly heading: Locator;
  readonly membersCard: Locator;
  readonly emailAlertsCard: Locator;
  readonly emailSwitch: Locator;
  readonly emailSeverity: Locator;
  readonly emailSave: Locator;
  readonly apiKeysHeading: Locator;
  readonly keyNameInput: Locator;
  readonly createKey: Locator;
  readonly auditLogHeading: Locator;
  readonly downloadCsv: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: headings.settings, exact: true });
    this.membersCard = page.getByTestId('members-card');
    this.emailAlertsCard = page.getByTestId('email-alerts-card');
    this.emailSwitch = this.emailAlertsCard.getByRole('switch');
    this.emailSeverity = this.emailAlertsCard.locator('select');
    this.emailSave = this.emailAlertsCard.getByRole('button', { name: copy.save, exact: true });
    this.apiKeysHeading = page.getByRole('heading', { name: headings.apiKeys, exact: true });
    this.keyNameInput = page.getByPlaceholder('For example Portfolio sync');
    this.createKey = page.getByRole('button', { name: copy.createKey, exact: true });
    this.auditLogHeading = page.getByRole('heading', { name: headings.auditLog, exact: true });
    this.downloadCsv = page.getByRole('button', { name: copy.downloadCsv, exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto(routes.settings);
  }

  async emailAlertsEnabled(): Promise<boolean> {
    return (await this.emailSwitch.getAttribute('aria-checked')) === 'true';
  }

  async setEmailAlerts(enabled: boolean): Promise<void> {
    if ((await this.emailAlertsEnabled()) !== enabled) {
      await this.emailSwitch.click();
    }
  }

  async createApiKey(name: string): Promise<void> {
    await this.apiKeysHeading.scrollIntoViewIfNeeded();
    await this.keyNameInput.fill(name);
    await this.createKey.click();
    await this.page.getByText(`Key ${name} created`).waitFor({ state: 'visible' });
    await this.page.getByRole('button', { name: 'Done', exact: true }).click();
  }

  keyRow(name: string): Locator {
    return this.page.getByRole('row', { name: new RegExp(name) });
  }

  async revokeApiKey(name: string): Promise<void> {
    await this.keyRow(name).getByRole('button', { name: copy.revoke, exact: true }).click();
    await this.page.getByRole('button', { name: copy.revokeKey, exact: true }).click();
  }

  async downloadAuditCsv(): Promise<Download> {
    await this.auditLogHeading.scrollIntoViewIfNeeded();
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadCsv.click(),
    ]);
    return download;
  }
}
