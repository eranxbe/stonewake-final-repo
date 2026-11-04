import { test, expect } from '../../src/fixtures/test';
import { routes } from '../../src/constants/routes';
import { assertHardeningHeaders } from '../../src/security/assertSafeApiResponse';

test('security 15 headers ui login', { tag: ['@security', '@ui'] }, async ({ page }) => {
  const response = await page.goto(routes.login);
  expect(response).toBeTruthy();
  expect(response!.ok()).toBeTruthy();
  assertHardeningHeaders(response!.headers());

  const csp = response!.headers()['content-security-policy'] ?? '';
  expect(csp, 'app should send CSP').toBeTruthy();
  expect(csp).toMatch(/frame-ancestors/i);
});
