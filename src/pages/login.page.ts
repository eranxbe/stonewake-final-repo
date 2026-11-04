import type { Locator, Page } from '@playwright/test';
import { EMAIL, PASSWORD } from '../constants/env';
import { copy } from '../constants/messages';
import { routes } from '../constants/routes';

export class LoginPage {
  readonly heading: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly terms: Locator;
  readonly submit: Locator;
  readonly termsLink: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Sign in', exact: true });
    this.email = page.locator('input[type="email"]');
    this.password = page.locator('input[type="password"]');
    this.terms = page.locator('button[role="checkbox"]');
    this.submit = page.locator('button[type="submit"]');
    this.termsLink = page.getByRole('link', { name: copy.termsOfService });
    this.error = page.getByText(copy.loginMismatch);
  }

  async open(): Promise<void> {
    await this.page.goto(routes.login);
  }

  async openHomeExpectLogin(): Promise<void> {
    await this.page.goto(routes.home);
    await this.page.waitForURL('**/login');
  }

  async fill(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
  }

  async acceptTerms(): Promise<void> {
    await this.terms.click();
  }

  async checkTerms(): Promise<void> {
    await this.terms.check();
  }

  async uncheckTerms(): Promise<void> {
    await this.terms.uncheck();
  }

  async submitForm(): Promise<void> {
    await this.submit.click();
  }

  async signIn(email = EMAIL, password = PASSWORD): Promise<void> {
    await this.open();
    await this.fill(email, password);
    await this.acceptTerms();
    await this.submitForm();
    await this.page.waitForURL(routes.home);
  }
}
