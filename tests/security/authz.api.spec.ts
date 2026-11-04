import { test, expect } from '../../src/fixtures/test';
import { credentials } from '../../src/constants/data';
import { apiErrors } from '../../src/constants/messages';
import { pathTraversalPayloads } from '../../src/constants/security';
import { assertSafeApiResponse } from '../../src/security/assertSafeApiResponse';

test('security 7 authz path traversal ids', { tag: ['@security', '@api'] }, async ({ api }) => {
  for (const payload of pathTraversalPayloads) {
    const responses = [
      await api.entity(payload),
      await api.node(payload),
      await api.nodeCompany(payload),
      await api.deal(payload),
      await api.dealReportPdf(payload),
      await api.screening(payload),
    ];

    for (const response of responses) {
      await assertSafeApiResponse(response);
      expect([400, 404, 422]).toContain(response.status());
    }
  }
});

test('security 8 authz malformed credentials', { tag: ['@security', '@api'] }, async ({ api }) => {
  const cases = [
    await api.me({ bearer: '' }),
    await api.me({ bearer: credentials.invalidApiKey }),
    await api.me({ authorization: 'Bearer' }),
    await api.me({ authorization: credentials.basicAuth }),
    await api.me({ authorization: `Bearer ${credentials.notAKey}` }),
    await api.portfolio(undefined, { bearer: credentials.invalidApiKey }),
    await api.search({ q: 'bank' }, { authorization: 'Token abc' }),
  ];

  for (const response of cases) {
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual(apiErrors.unauthenticated);
  }
});
