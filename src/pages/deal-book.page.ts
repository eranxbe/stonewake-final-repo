import type { Locator, Page } from '@playwright/test';
import { routes } from '../constants/routes';

export class DealBookPage {
  readonly heading: Locator;
  readonly sectorSelect: Locator;
  readonly selectedTab: Locator;
  readonly search: Locator;
  readonly dealLinks: Locator;
  readonly briefing: Locator;
  readonly noMatches: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('h1');
    this.sectorSelect = page.locator('select[aria-label="All sectors"]');
    this.selectedTab = page.locator('[role="tab"][aria-selected="true"]');
    this.search = page.locator('input[placeholder="Search deals…"]');
    this.dealLinks = page.locator("main a[href^='/deals/']");
    this.briefing = page.getByRole('heading', { name: 'Briefing', exact: true });
    this.noMatches = page.getByText('No matching deals');
  }

  async open(): Promise<void> {
    await this.page.goto(routes.home);
  }

  firstDeal(): Locator {
    return this.dealLinks.first();
  }

  async searchDeals(query: string): Promise<void> {
    await this.search.fill(query);
  }

  async clearSearch(): Promise<void> {
    await this.search.fill('');
  }

  async openDeal(href: string): Promise<void> {
    await this.page.locator(`main a[href='${href}']`).click();
    await this.page.waitForURL(`**${href}`);
  }
}
