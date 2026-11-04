import type { Locator, Page } from '@playwright/test';
import { copy, headings } from '../constants/messages';
import { routes } from '../constants/routes';

export class MonitoringPage {
  readonly heading: Locator;
  readonly emptyState: Locator;
  readonly monitorAName: Locator;
  readonly portfolioLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('h1');
    this.emptyState = page.getByText(copy.nothingMonitoredYet);
    this.monitorAName = page.getByRole('button', { name: copy.monitorAName, exact: true });
    this.portfolioLink = page.getByTestId('monitoring-elsewhere').getByRole('link', {
      name: headings.portfolio,
      exact: true,
    });
  }

  async open(): Promise<void> {
    await this.page.goto(routes.monitoring);
  }
}
