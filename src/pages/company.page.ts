import type { Download, Locator, Page } from '@playwright/test';
import { copy, headings } from '../constants/messages';
import { routes } from '../constants/routes';

export class CompanyPage {
  readonly heading: Locator;
  readonly financing: Locator;
  readonly ownershipChain: Locator;
  readonly downloadProfile: Locator;
  readonly downloadDeck: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('h1');
    this.financing = page.getByRole('heading', { name: headings.financing, exact: true });
    this.ownershipChain = page.getByRole('heading', { name: headings.ownershipChain, exact: true });
    this.downloadProfile = page.getByRole('button', { name: copy.downloadCompanyProfile, exact: true });
    this.downloadDeck = page.getByRole('button', { name: copy.downloadDeck, exact: true });
  }

  async open(nodeId: string | number): Promise<void> {
    await this.page.goto(routes.company(nodeId));
  }

  async downloadCompanyProfile(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadProfile.click(),
    ]);
    return download;
  }

  async downloadRiskDeck(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadDeck.click(),
    ]);
    return download;
  }
}
