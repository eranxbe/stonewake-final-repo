import type { Locator, Page } from '@playwright/test';
import { routes } from '../constants/routes';

export class CountriesPage {
  readonly heading: Locator;
  readonly search: Locator;
  readonly countryLinks: Locator;
  readonly noMatches: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('h1');
    this.search = page.locator('input[aria-label="Search countries"]');
    this.countryLinks = page.locator("table a[href^='/countries/']");
    this.noMatches = page.getByText('No matching countries');
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
}

export class CountryDetailPage {
  readonly heading: Locator;
  readonly risk: Locator;
  readonly dataSources: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('h1');
    this.risk = page.getByRole('heading', { name: 'Country risk', exact: true });
    this.dataSources = page.getByRole('heading', { name: 'Data sources', exact: true });
  }

  async open(iso3: string): Promise<void> {
    await this.page.goto(routes.country(iso3));
  }
}
