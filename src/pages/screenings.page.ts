import type { Locator, Page } from '@playwright/test';
import { copy } from '../constants/messages';
import { routes } from '../constants/routes';

export class ScreeningsPage {
  readonly heading: Locator;
  readonly emptyState: Locator;
  readonly newScreening: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('h1');
    this.emptyState = page.getByText(copy.nothingScreenedYet);
    this.newScreening = page.getByRole('button', { name: copy.newScreening, exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto(routes.screenings);
  }
}
