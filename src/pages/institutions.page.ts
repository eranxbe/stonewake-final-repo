import type { Locator, Page } from '@playwright/test';
import { routes } from '../constants/routes';

export class InstitutionsPage {
  readonly heading: Locator;
  readonly kind: Locator;
  readonly country: Locator;
  readonly search: Locator;
  readonly entityLinks: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('h1');
    this.kind = page.locator('select[aria-label="Kind"]');
    this.country = page.locator('select[aria-label="Country"]');
    this.search = page.locator('input[placeholder="Search institutions…"]');
    this.entityLinks = page.locator("main a[href^='/entities/']");
  }

  async open(): Promise<void> {
    await this.page.goto(routes.entities);
  }

  async searchInstitutions(query: string): Promise<void> {
    await this.search.fill(query);
  }

  entityLink(id: string | number): Locator {
    return this.page.locator(`main a[href="/entities/${id}"]`);
  }

  async openEntity(id: string | number): Promise<void> {
    await this.entityLink(id).click();
    await this.page.waitForURL(routes.entity(id));
  }
}
