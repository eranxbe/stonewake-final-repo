import type { Locator, Page } from '@playwright/test';
import { copy } from '../constants/messages';
import { routes } from '../constants/routes';

export class TendersPage {
  readonly heading: Locator;
  readonly matches: Locator;
  readonly matchCards: Locator;
  readonly matchCount: Locator;
  readonly matchesTab: Locator;
  readonly profilesTab: Locator;
  readonly newFilter: Locator;
  readonly inDealBookFilter: Locator;
  readonly dismissedFilter: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('h1');
    this.matches = page.getByTestId('tender-matches');
    this.matchCards = page.getByTestId('tender-match');
    this.matchCount = page.getByTestId('tender-match-count');
    this.matchesTab = page.getByRole('tab', { name: copy.matchesTab, exact: true });
    this.profilesTab = page.getByRole('tab', { name: copy.profilesTab, exact: true });
    this.newFilter = page.getByRole('button', { name: copy.newMatches, exact: true });
    this.inDealBookFilter = page.getByRole('button', { name: copy.inDealBook, exact: true });
    this.dismissedFilter = page.getByRole('button', { name: copy.dismissed, exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto(routes.tenders);
  }

  firstMatch(): Locator {
    return this.matchCards.first();
  }

  matchTitle(match: Locator): Promise<string> {
    return match.locator('a').first().innerText();
  }

  async filterNew(): Promise<void> {
    await this.newFilter.click();
  }

  async filterDismissed(): Promise<void> {
    await this.dismissedFilter.click();
  }

  async filterInDealBook(): Promise<void> {
    await this.inDealBookFilter.click();
  }

  async openWhy(match: Locator): Promise<void> {
    await match.getByRole('button', { name: copy.whyThisMatch, exact: true }).click();
  }

  noticeLink(match: Locator): Locator {
    return match.getByTestId('tender-notice-link');
  }

  async dismiss(match: Locator): Promise<void> {
    await Promise.all([
      this.page.waitForResponse((res) => res.url().includes('/tenders/matches/') && res.url().includes('/dismiss') && res.ok()),
      match.getByRole('button', { name: copy.dismiss, exact: true }).click(),
    ]);
  }

  async addToDealBook(match: Locator): Promise<void> {
    await Promise.all([
      this.page.waitForResponse((res) => res.url().includes('/to-deal-book') && res.ok()),
      match.getByTestId('tender-take').click(),
    ]);
  }
}
