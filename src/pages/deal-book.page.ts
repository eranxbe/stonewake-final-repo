import type { Download, Locator, Page } from '@playwright/test';
import { copy } from '../constants/messages';
import { routes } from '../constants/routes';

export class DealBookPage {
  readonly heading: Locator;
  readonly sectorSelect: Locator;
  readonly regionSelect: Locator;
  readonly windowSelect: Locator;
  readonly selectedTab: Locator;
  readonly search: Locator;
  readonly dealLinks: Locator;
  readonly briefing: Locator;
  readonly sourceLinks: Locator;
  readonly downloadReport: Locator;
  readonly downloadDeck: Locator;
  readonly exportButton: Locator;
  readonly noMatches: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('h1');
    this.sectorSelect = page.locator('select[aria-label="All sectors"]');
    this.regionSelect = page.locator('select[aria-label="All regions"]');
    this.windowSelect = page.locator('select[aria-label="All windows"]');
    this.selectedTab = page.locator('[role="tab"][aria-selected="true"]');
    this.search = page.locator('input[placeholder="Search deals…"]');
    this.dealLinks = page.locator("main a[href^='/deals/']");
    this.briefing = page.getByRole('heading', { name: 'Briefing', exact: true });
    this.sourceLinks = page.locator('main a[href^="http"]');
    this.downloadReport = page.getByRole('button', { name: copy.downloadReport, exact: true });
    this.downloadDeck = page.getByRole('button', { name: copy.downloadDeck, exact: true });
    this.exportButton = page.getByRole('button', { name: copy.export, exact: true });
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

  async filterBySector(value: string): Promise<void> {
    await this.sectorSelect.selectOption(value);
  }

  async openDeal(href: string): Promise<void> {
    await this.page.locator(`main a[href='${href}']`).click();
    await this.page.waitForURL(`**${href}`);
  }

  async downloadDealReport(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadReport.click(),
    ]);
    return download;
  }

  async downloadDealDeck(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadDeck.click(),
    ]);
    return download;
  }

  async exportWorkbook(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportButton.click(),
    ]);
    return download;
  }
}
