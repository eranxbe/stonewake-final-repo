import { test, expect } from '@playwright/test';

function env(name: string): string {
  var value = process.env[name];
  if (!value) throw new Error('Missing ' + name + ' in .env');
  return value;
}

var APP = env('STONEWAKE_APP_URL');
var EMAIL = env('STONEWAKE_EMAIL');
var PASS = env('STONEWAKE_PASSWORD');

test('ui 1 login ok', { tag: ['@ui', '@smoke'] }, async ({ page }) => {
  await page.goto(APP + '/');
  await page.waitForTimeout(2000);
  expect(page.url()).toContain('/login');
  await expect(page).toHaveTitle('Sign in · Stonewake');
  await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  await page.fill('#email', EMAIL);
  await page.fill('input[type="password"]', PASS);
  await page.click('button[role="checkbox"]');
  await page.click('button[type="submit"]');
  await page.waitForURL(APP + '/');
  await expect(page).toHaveTitle('Deal Book · Stonewake');
  await expect(page.locator('h1')).toHaveText('Deal Book');
  await expect(page.locator('#app-sidebar')).toContainText('Team');
  await expect(page.locator('#app-sidebar a[data-tour="module-deals"]')).toBeVisible();
  await expect(page.locator('#app-sidebar a[data-tour="module-portfolio"]')).toBeVisible();
  await expect(page.locator('#app-sidebar a[data-tour="module-countries"]')).toBeVisible();
  await expect(page.locator('//aside//button[normalize-space(.)="Sign out"]')).toBeVisible();
});

test('ui 2 wrong password', { tag: ['@ui', '@smoke'] }, async ({ page }) => {
  await page.goto(APP + '/login');
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', 'definitely-wrong-password-123');
  await page.click('button[role="checkbox"]');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=That email and password do not match. Check both and try again.')).toBeVisible();
  expect(page.url()).toBe(APP + '/login');
  await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  await expect(page.locator('#app-sidebar')).toHaveCount(0);
});

test('ui 3 terms checkbox', { tag: ['@ui', '@regression'] }, async ({ page }) => {
  await page.goto(APP + '/login');
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASS);
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
  await page.check('input[type="checkbox"]');
  await expect(page.locator('button[type="submit"]')).toBeEnabled();
  await page.uncheck('input[type="checkbox"]');
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
  await expect(page.locator('//a[text()="Terms of Service"]')).toHaveAttribute('href', 'https://stonewake.ai/terms');
});

test('ui 4 not logged in redirect', { tag: ['@ui', '@regression'] }, async ({ page }) => {
  await page.goto(APP + '/');
  await page.waitForURL(APP + '/login');
  await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  await page.goto(APP + '/portfolio');
  await page.waitForURL(APP + '/login');
  await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  await page.goto(APP + '/countries/DEU');
  await page.waitForURL(APP + '/login');
  await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  await page.goto(APP + '/entities');
  await page.waitForURL(APP + '/login');
  await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  await expect(page.locator('#app-sidebar')).toHaveCount(0);
});

test('ui 5 logout', { tag: ['@ui', '@regression'] }, async ({ page }) => {
  await page.goto(APP + '/login');
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASS);
  await page.click('button[role="checkbox"]');
  await page.click('button[type="submit"]');
  await page.waitForURL(APP + '/');
  await expect(page.locator('h1')).toHaveText('Deal Book');
  await page.click('//aside//button[normalize-space(.)="Sign out"]');
  await page.waitForURL(APP + '/login');
  await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  await page.goto(APP + '/portfolio');
  await page.waitForURL(APP + '/login');
  await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
});

test('ui 6 sidebar', { tag: ['@ui', '@regression'] }, async ({ page }) => {
  await page.goto(APP + '/login');
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASS);
  await page.click('button[role="checkbox"]');
  await page.click('button[type="submit"]');
  await page.waitForURL(APP + '/');
  await page.click('#app-sidebar a[data-tour="module-countries"]');
  await page.waitForURL('**/countries');
  await expect(page.locator('h1')).toHaveText('Countries');
  await page.click('#app-sidebar a[data-tour="module-entities"]');
  await page.waitForURL('**/entities');
  await expect(page.locator('h1')).toHaveText('Institutions');
  await page.click('#app-sidebar a[data-tour="module-portfolio"]');
  await page.waitForURL('**/portfolio');
  await expect(page.locator('h1')).toHaveText('Portfolio');
  await page.click('//aside//a[normalize-space(.)="Monitoring"]');
  await page.waitForURL('**/monitoring');
  await expect(page.locator('h1')).toHaveText('Monitoring');
  await page.click('//aside//a[normalize-space(.)="Screenings"]');
  await page.waitForURL('**/screenings');
  await expect(page.locator('h1')).toHaveText('Screenings');
  await page.click('//aside//a[normalize-space(.)="EDD Dossier"]');
  await page.waitForURL('**/dossiers');
  await expect(page.locator('h1')).toHaveText('EDD Dossiers');
  await page.click('//aside//a[normalize-space(.)="Scoring"]');
  await page.waitForURL('**/scoring');
  await expect(page.locator('h1')).toHaveText('Scoring');
});

test('ui 7 deal book search', { tag: ['@ui', '@regression'] }, async ({ page }) => {
  await page.goto(APP + '/login');
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASS);
  await page.click('button[role="checkbox"]');
  await page.click('button[type="submit"]');
  await page.waitForURL(APP + '/');
  await page.waitForTimeout(3000);
  await expect(page.locator('select[aria-label="All sectors"]')).toBeVisible();
  await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveText('Deals');
  var link = page.locator("main a[href^='/deal/']").first();
  await expect(link).toBeVisible();
  var href = await link.getAttribute('href');
  await page.fill('input[placeholder="Search deals…"]', 'zzzzqqxx');
  await expect(page.locator('text=No matching deals')).toBeVisible();
  await page.fill('input[placeholder="Search deals…"]', '');
  await page.click("main a[href='" + href + "']");
  await page.waitForURL('**' + href);
  await expect(page.locator('//h2[text()="Briefing"]')).toBeVisible();
});

test('ui 8 countries', { tag: ['@ui', '@regression'] }, async ({ page }) => {
  await page.goto(APP + '/login');
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASS);
  await page.click('button[role="checkbox"]');
  await page.click('button[type="submit"]');
  await page.waitForURL(APP + '/');
  await page.goto(APP + '/countries');
  await expect(page.locator('h1')).toHaveText('Countries');
  await page.fill('input[aria-label="Search countries"]', 'Germany');
  await page.waitForTimeout(1000);
  await page.click('main a[href="/countries/DEU"]');
  await page.waitForURL(APP + '/countries/DEU');
  await expect(page.locator('h1')).toHaveText('Germany');
  await expect(page.locator('//h2[text()="Country risk"]')).toBeVisible();
  await expect(page.locator('//h2[text()="Data sources"]')).toBeVisible();
  await page.goto(APP + '/countries');
  await page.fill('input[aria-label="Search countries"]', 'Zzzzqq');
  await expect(page.locator('text=No matching countries')).toBeVisible();
  await expect(page.locator("table a[href^='/countries/']")).toHaveCount(0);
  await page.goto(APP + '/countries/ZZZ');
  await expect(page).toHaveTitle('Page not found · Stonewake');
});

test('ui 9 institutions', { tag: ['@ui', '@regression'] }, async ({ page }) => {
  await page.goto(APP + '/login');
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASS);
  await page.click('button[role="checkbox"]');
  await page.click('button[type="submit"]');
  await page.waitForURL(APP + '/');
  await page.goto(APP + '/entities');
  await expect(page.locator('h1')).toHaveText('Institutions');
  await expect(page.locator('select[aria-label="Kind"]')).toBeVisible();
  await expect(page.locator('select[aria-label="Country"]')).toBeVisible();
  await page.fill('input[placeholder="Search institutions…"]', 'UKEF');
  await expect(page.locator('main a[href="/entities/4"]')).toContainText('UK Export Finance');
  await expect(page.locator("main a[href^='/entities/']")).toHaveCount(1);
  await page.click('main a[href="/entities/4"]');
  await page.waitForURL(APP + '/entities/4');
  await expect(page).toHaveTitle('Institutions · Stonewake');
  await expect(page.locator('h1')).toBeVisible();
});

test('ui 10 portfolio', { tag: ['@ui', '@regression'] }, async ({ page }) => {
  await page.goto(APP + '/login');
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASS);
  await page.click('button[role="checkbox"]');
  await page.click('button[type="submit"]');
  await page.waitForURL(APP + '/');
  await page.goto(APP + '/portfolio');
  await expect(page.locator('h1')).toHaveText('Portfolio');
  await expect(page.locator('[data-testid="tile-red"]')).toBeVisible();
  await expect(page.locator('[data-testid="tile-amber"]')).toBeVisible();
  await expect(page.locator('[data-testid="tile-green"]')).toBeVisible();
  await expect(page.locator('[data-testid="tile-insufficient"]')).toBeVisible();
  await expect(page.locator('[data-testid="tile-not-assessed"]')).toBeVisible();
  var first = page.locator('tbody a[href^="/entities/n"]').first();
  await expect(first).toBeVisible();
  var name = (await first.innerText()).trim();
  await first.click();
  await page.waitForURL(/\/entities\/n\d+/);
  await expect(page.locator('h1')).toHaveText(name);
});
