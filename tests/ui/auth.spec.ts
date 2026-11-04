import { test, expect } from '../../src/fixtures/test';
import { APP_URL, EMAIL, PASSWORD } from '../../src/constants/env';
import { credentials } from '../../src/constants/data';
import { copy, headings, titles } from '../../src/constants/messages';
import { routes } from '../../src/constants/routes';


test('ui 1 login ok', { tag: ['@ui', '@smoke'] }, async ({ page, loginPage, appShell, dealBookPage }) => {
  await loginPage.openHomeExpectLogin();
  expect(page.url()).toContain(routes.login);
  await expect(page).toHaveTitle(titles.signIn);
  await expect(loginPage.heading).toBeVisible();

  await loginPage.fill(EMAIL, PASSWORD);
  await loginPage.acceptTerms();
  await loginPage.submitForm();
  await page.waitForURL(routes.home);

  await expect(page).toHaveTitle(titles.dealBook);
  await expect(dealBookPage.heading).toHaveText(headings.dealBook);
  await expect(appShell.sidebar).toContainText(copy.team);
  await expect(appShell.module('deals')).toBeVisible();
  await expect(appShell.module('portfolio')).toBeVisible();
  await expect(appShell.module('countries')).toBeVisible();
  await expect(appShell.signOut).toBeVisible();
});

test('ui 2 wrong password', { tag: ['@ui', '@smoke'] }, async ({ page, loginPage, appShell }) => {
  await loginPage.open();
  await loginPage.fill(EMAIL, credentials.wrongPassword);
  await loginPage.acceptTerms();
  await loginPage.submitForm();

  await expect(loginPage.error).toBeVisible();
  expect(page.url()).toBe(`${APP_URL}${routes.login}`);
  await expect(loginPage.heading).toBeVisible();
  await expect(appShell.sidebar).toHaveCount(0);
});

test('ui 3 terms checkbox', { tag: ['@ui', '@regression'] }, async ({ loginPage }) => {
  await loginPage.open();
  await expect(loginPage.submit).toBeDisabled();

  await loginPage.fill(EMAIL, PASSWORD);
  await expect(loginPage.submit).toBeDisabled();

  await loginPage.checkTerms();
  await expect(loginPage.submit).toBeEnabled();

  await loginPage.uncheckTerms();
  await expect(loginPage.submit).toBeDisabled();
  await expect(loginPage.termsLink).toHaveAttribute('href', copy.termsHref);
});

test('ui 4 not logged in redirect', { tag: ['@ui', '@regression'] }, async ({ page, loginPage, appShell }) => {
  const protectedPaths = [routes.home, routes.portfolio, routes.country('DEU'), routes.entities];

  for (const path of protectedPaths) {
    await page.goto(path);
    await page.waitForURL(`**${routes.login}`);
    await expect(loginPage.heading).toBeVisible();
  }

  await expect(appShell.sidebar).toHaveCount(0);
});

test('ui 5 logout', { tag: ['@ui', '@regression'] }, async ({ page, loginPage, appShell, dealBookPage }) => {
  await loginPage.signIn();
  await expect(dealBookPage.heading).toHaveText(headings.dealBook);

  await appShell.signOutAndWait();
  await expect(loginPage.heading).toBeVisible();

  await page.goto(routes.portfolio);
  await page.waitForURL(`**${routes.login}`);
  await expect(loginPage.heading).toBeVisible();
});
