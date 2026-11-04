import { test as base, expect, type Page } from '@playwright/test';
import { ApiClient } from '../clients/api.client';
import { LoginPage } from '../pages/login.page';
import { AppShell } from '../pages/app-shell.page';
import { DealBookPage } from '../pages/deal-book.page';
import { CountriesPage, CountryDetailPage } from '../pages/countries.page';
import { InstitutionsPage } from '../pages/institutions.page';
import { PortfolioPage } from '../pages/portfolio.page';
import { CompanyPage } from '../pages/company.page';
import { ScreeningsPage } from '../pages/screenings.page';
import { MonitoringPage } from '../pages/monitoring.page';
import { TendersPage } from '../pages/tenders.page';
import { SettingsPage } from '../pages/settings.page';

type Fixtures = {
  api: ApiClient;
  loginPage: LoginPage;
  appShell: AppShell;
  dealBookPage: DealBookPage;
  countriesPage: CountriesPage;
  countryDetailPage: CountryDetailPage;
  institutionsPage: InstitutionsPage;
  portfolioPage: PortfolioPage;
  companyPage: CompanyPage;
  screeningsPage: ScreeningsPage;
  monitoringPage: MonitoringPage;
  tendersPage: TendersPage;
  settingsPage: SettingsPage;
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

  companyPage: async ({ page }, use) => {
    await use(new CompanyPage(page));
  },

  screeningsPage: async ({ page }, use) => {
    await use(new ScreeningsPage(page));
  },

  monitoringPage: async ({ page }, use) => {
    await use(new MonitoringPage(page));
  },

  tendersPage: async ({ page }, use) => {
    await use(new TendersPage(page));
  },

  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },

  loggedInPage: async ({ page, loginPage }, use) => {
    await loginPage.signIn();
    await use(page);
  },
});

export { expect };
