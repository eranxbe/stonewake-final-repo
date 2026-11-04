import type { Locator, Page } from '@playwright/test';
import { routes } from '../constants/routes';

export class PortfolioPage {
  readonly heading: Locator;
  readonly tileRed: Locator;
  readonly tileAmber: Locator;
  readonly tileGreen: Locator;
  readonly tileInsufficient: Locator;
  readonly tileNotAssessed: Locator;
  readonly entityLinks: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('h1');
    this.tileRed = page.locator('[data-testid="tile-red"]');
    this.tileAmber = page.locator('[data-testid="tile-amber"]');
    this.tileGreen = page.locator('[data-testid="tile-green"]');
    this.tileInsufficient = page.locator('[data-testid="tile-insufficient"]');
    this.tileNotAssessed = page.locator('[data-testid="tile-not_assessed"]');
    this.entityLinks = page.locator('tbody a[href^="/entities/n"]');
  }

  async open(): Promise<void> {
    await this.page.goto(routes.portfolio);
  }

  firstEntity(): Locator {
    return this.entityLinks.first();
  }

  async openFirstEntity(): Promise<string> {
    const first = this.firstEntity();
    const name = (await first.innerText()).trim();
    await first.click();
    await this.page.waitForURL(/\/entities\/n\d+/);
    return name;
  }
}
