import type { Locator, Page } from '@playwright/test';
import { copy } from '../constants/messages';
import { routes } from '../constants/routes';

type ModuleName =
  | 'deals'
  | 'tenders'
  | 'portfolio'
  | 'countries'
  | 'entities'
  | 'network'
  | 'monitoring'
  | 'screenings'
  | 'scoring';

export class AppShell {
  readonly sidebar: Locator;
  readonly signOut: Locator;
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.sidebar = page.locator('#app-sidebar');
    this.signOut = page.locator('aside').getByRole('button', { name: copy.signOut, exact: true });
    this.heading = page.locator('h1');
  }

  module(name: ModuleName): Locator {
    return this.sidebar.locator(`a[data-tour="module-${name}"]`);
  }

  navLink(label: string): Locator {
    return this.page.locator('aside').getByRole('link', { name: label, exact: true });
  }

  settingsLink(workspaceName: string): Locator {
    return this.page.locator('aside').getByRole('link', { name: workspaceName, exact: true });
  }

  async goToModule(name: ModuleName): Promise<void> {
    await this.module(name).click();
  }

  async goToNav(label: string, urlGlob: string): Promise<void> {
    await this.navLink(label).click();
    await this.page.waitForURL(urlGlob);
  }

  async openSettings(workspaceName: string): Promise<void> {
    await this.settingsLink(workspaceName).click();
    await this.page.waitForURL(`**${routes.settings}`);
  }

  async signOutAndWait(): Promise<void> {
    await this.signOut.click();
    await this.page.waitForURL(`**${routes.login}`);
  }
}
