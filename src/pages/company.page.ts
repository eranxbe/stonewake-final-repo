import type { Locator, Page } from '@playwright/test';
import { headings } from '../constants/messages';
import { routes } from '../constants/routes';

export class CompanyPage {
  readonly heading: Locator;
  readonly financing: Locator;
  readonly ownershipChain: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('h1');
    this.financing = page.getByRole('heading', { name: headings.financing, exact: true });
    this.ownershipChain = page.getByRole('heading', { name: headings.ownershipChain, exact: true });
  }

  async open(nodeId: string | number): Promise<void> {
    await this.page.goto(routes.company(nodeId));
  }
}
