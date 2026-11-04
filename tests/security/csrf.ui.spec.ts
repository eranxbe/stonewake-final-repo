import { request as playwrightRequest } from '@playwright/test';
import { test, expect } from '../../src/fixtures/test';
import { API_URL } from '../../src/constants/env';
import { apiRoutes } from '../../src/constants/routes';
import { apiErrors } from '../../src/constants/messages';

test('security 12 csrf session cookies hardened', { tag: ['@security', '@ui'] }, async ({
  loggedInPage,
}) => {
  const cookies = await loggedInPage.context().cookies();
  expect(cookies.length).toBeGreaterThan(0);

  const sessionLike = cookies.filter(
    (c) =>
      /session|auth|token|sb-|supabase|jwt|access/i.test(c.name) || c.httpOnly || c.secure,
  );
  expect(sessionLike.length, 'expected at least one session/auth cookie after login').toBeGreaterThan(0);

  for (const cookie of sessionLike) {
    if (cookie.httpOnly) {
      expect(cookie.secure, `${cookie.name} HttpOnly cookie should be Secure`).toBe(true);
    }
    if (cookie.sameSite) {
      expect(['Strict', 'Lax', 'None']).toContain(cookie.sameSite);
      if (cookie.sameSite === 'None') {
        expect(cookie.secure, `${cookie.name} SameSite=None requires Secure`).toBe(true);
      }
    }
  }
});

test('security 13 csrf api rejects cookie-only auth', { tag: ['@security', '@ui'] }, async ({
  loggedInPage,
}) => {
  const cookies = await loggedInPage.context().cookies();
  const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const api = await playwrightRequest.newContext({
    baseURL: API_URL,
    extraHTTPHeaders: cookieHeader ? { Cookie: cookieHeader } : {},
  });

  try {
    const me = await api.get(apiRoutes.me);
    expect(me.status()).toBe(401);
    expect(await me.json()).toEqual(apiErrors.unauthenticated);

    const portfolio = await api.get(apiRoutes.portfolio);
    expect(portfolio.status()).toBe(401);
    expect(await portfolio.json()).toEqual(apiErrors.unauthenticated);
  } finally {
    await api.dispose();
  }
});

test('security 14 csrf forged origin does not unlock api', { tag: ['@security', '@ui'] }, async ({
  loggedInPage,
}) => {
  const cookies = await loggedInPage.context().cookies();
  const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const api = await playwrightRequest.newContext({
    baseURL: API_URL,
    extraHTTPHeaders: {
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      Origin: 'https://evil.example',
      Referer: 'https://evil.example/attack',
    },
  });

  try {
    const me = await api.get(apiRoutes.me);
    expect(me.status()).toBe(401);
    expect(await me.json()).toEqual(apiErrors.unauthenticated);
  } finally {
    await api.dispose();
  }
});
