import type { Locator, Page } from '@playwright/test';
import { copy, headings } from '../constants/messages';
import { routes } from '../constants/routes';

export class MonitoringPage {
  readonly heading: Locator;
  readonly emptyState: Locator;
  readonly monitorAName: Locator;
  readonly portfolioLink: Locator;
  readonly nameInput: Locator;
  readonly monitorThisName: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('h1');
    this.emptyState = page.getByText(copy.nothingMonitoredYet);
    this.monitorAName = page.getByRole('button', { name: copy.monitorAName, exact: true });
    this.portfolioLink = page.getByTestId('monitoring-elsewhere').getByRole('link', {
      name: headings.portfolio,
      exact: true,
    });
    this.nameInput = page.getByPlaceholder('Company, person, brand or topic');
    this.monitorThisName = page.getByRole('button', { name: 'Monitor this name', exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto(routes.monitoring);
  }

  targetRow(name: string): Locator {
    return this.page.locator('tr', { hasText: name }).first();
  }

  async addName(query: string, suggestion: string, rowName: string): Promise<void> {
    await this.monitorAName.click();
    await this.nameInput.fill(query);
    await this.page.getByText(suggestion, { exact: true }).first().click();
    await this.monitorThisName.click();
    await this.targetRow(rowName).waitFor({ state: 'visible' });
  }

  frequencySelect(name: string): Locator {
    return this.targetRow(name).locator('select');
  }

  activeSwitch(name: string): Locator {
    return this.targetRow(name).getByRole('switch');
  }

  async setFrequency(name: string, label: 'Hourly' | 'Daily' | 'Every 2 days' | 'Weekly'): Promise<void> {
    await this.frequencySelect(name).selectOption({ label });
  }

  async setActive(name: string, enabled: boolean): Promise<void> {
    const sw = this.activeSwitch(name);
    const checked = (await sw.getAttribute('aria-checked')) === 'true';
    if (checked !== enabled) await sw.click();
  }

  async removeTarget(name: string): Promise<void> {
    await this.targetRow(name).getByRole('button', { name: `Remove ${name}` }).click();
    await this.page.getByRole('button', { name: 'Confirm', exact: true }).click();
    await this.targetRow(name).waitFor({ state: 'hidden' });
  }
}
