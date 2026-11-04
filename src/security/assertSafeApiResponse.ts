import { expect, type APIResponse } from '@playwright/test';
import { safeApiStatuses, sqlErrorPatterns } from '../constants/security';

export async function assertSafeApiResponse(response: APIResponse): Promise<void> {
  const status = response.status();
  expect(
    safeApiStatuses,
    `unexpected status ${status} for ${response.url()}`,
  ).toContain(status);

  const body = await response.text();
  for (const pattern of sqlErrorPatterns) {
    expect(body, `SQL/DB error leak matching ${pattern} in ${response.url()}`).not.toMatch(pattern);
  }
}

export function assertHardeningHeaders(headers: Record<string, string>): void {
  const lower = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
  );

  expect(lower['strict-transport-security'], 'missing HSTS').toBeTruthy();
  expect(lower['strict-transport-security']).toMatch(/max-age=\d+/i);
  expect(lower['x-content-type-options']?.toLowerCase()).toBe('nosniff');
  expect(lower['referrer-policy']).toBeTruthy();
  expect(lower['permissions-policy']).toBeTruthy();

  const xfo = lower['x-frame-options']?.toUpperCase();
  const csp = lower['content-security-policy'] ?? '';
  const framed =
    xfo === 'DENY' ||
    xfo === 'SAMEORIGIN' ||
    /frame-ancestors\s+('none'|none)/i.test(csp);
  expect(framed, 'missing frame denial (X-Frame-Options or CSP frame-ancestors)').toBe(true);
}
