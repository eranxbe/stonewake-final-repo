import { test as base, expect, type Page } from '@playwright/test';
import { ApiClient } from '../clients/api.client';
import { LoginPage } from '../pages/login.page';
import { AppShell } from '../pages/app-shell.page';
import { DealBookPage } from '../pages/deal-book.page';
import { CountriesPage, CountryDetailPage } from '../pages/countries.page';
import { InstitutionsPage } from '../pages/institutions.page';
import { PortfolioPage } from '../pages/portfolio.page';

type Fixtures = {
  api: ApiClient;
  loginPage: LoginPage;
  appShell: AppShell;
  dealBookPage: DealBookPage;
  countriesPage: CountriesPage;
  countryDetailPage: CountryDetailPage;
  institutionsPage: InstitutionsPage;
  portfolioPage: PortfolioPage;
  loggedInPage: Page;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  appShell: async ({ page }, use) => {
    await use(new AppShell(page));
  },

  dealBookPage: async ({ page }, use) => {
    await use(new DealBookPage(page));
  },

  countriesPage: async ({ page }, use) => {
    await use(new CountriesPage(page));
  },

  countryDetailPage: async ({ page }, use) => {
    await use(new CountryDetailPage(page));
  },

  institutionsPage: async ({ page }, use) => {
    await use(new InstitutionsPage(page));
  },

  portfolioPage: async ({ page }, use) => {
    await use(new PortfolioPage(page));
  },

  loggedInPage: async ({ page, loginPage }, use) => {
    await loginPage.signIn();
    await use(page);
  },
});

export { expect };
