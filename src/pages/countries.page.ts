import type { Download, Locator, Page } from '@playwright/test';
import { copy } from '../constants/messages';
import { routes } from '../constants/routes';

export class CountriesPage {
  readonly heading: Locator;
  readonly search: Locator;
  readonly countryLinks: Locator;
  readonly noMatches: Locator;
  readonly exportButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('h1');
    this.search = page.locator('input[aria-label="Search countries"]');
    this.countryLinks = page.locator("table a[href^='/countries/']");
    this.noMatches = page.getByText('No matching countries');
    this.exportButton = page.getByRole('button', { name: copy.export, exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto(routes.countries);
  }

  async searchCountries(query: string): Promise<void> {
    await this.search.fill(query);
  }

  countryLink(iso3: string): Locator {
    return this.page.locator(`main a[href="/countries/${iso3}"]`);
  }

  async openCountry(iso3: string): Promise<void> {
    await this.countryLink(iso3).click();
    await this.page.waitForURL(routes.country(iso3));
  }

  async exportWorkbook(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportButton.click(),
    ]);
    return download;
  }
}

export class CountryDetailPage {
  readonly heading: Locator;
  readonly risk: Locator;
  readonly dataSources: Locator;
  readonly downloadReport: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('h1');
    this.risk = page.getByRole('heading', { name: 'Country risk', exact: true });
    this.dataSources = page.getByRole('heading', { name: 'Data sources', exact: true });
    this.downloadReport = page.getByRole('button', { name: copy.downloadReport, exact: true });
  }

  async open(iso3: string): Promise<void> {
    await this.page.goto(routes.country(iso3));
  }

  async downloadCountryReport(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadReport.click(),
    ]);
    return download;
  }
}
