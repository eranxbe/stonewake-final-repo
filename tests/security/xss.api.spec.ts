import { test, expect } from '../../src/fixtures/test';
import { xssPayloads } from '../../src/constants/security';
import { assertSafeApiResponse } from '../../src/security/assertSafeApiResponse';

test('security 4 xss api search reflection', { tag: ['@security', '@api'] }, async ({ api }) => {
  for (const payload of xssPayloads) {
    const response = await api.search({ q: payload, limit: 3 });
    await assertSafeApiResponse(response);

    const contentType = response.headers()['content-type'] ?? '';
    expect(contentType).toMatch(/application\/json/i);

    if (response.status() === 200) {
      const json = await response.json();
      expect(json.query).toBe(payload);
      expect(typeof json).toBe('object');
    }
  }
});

test('security 5 xss api deals reflection', { tag: ['@security', '@api'] }, async ({ api }) => {
  for (const payload of xssPayloads) {
    const response = await api.deals({ q: payload, limit: 3 });
    await assertSafeApiResponse(response);

    const contentType = response.headers()['content-type'] ?? '';
    expect(contentType).toMatch(/application\/json/i);
    expect(contentType).not.toMatch(/text\/html/i);
  }
});
