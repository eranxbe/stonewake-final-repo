import { test, expect } from '../../src/fixtures/test';
import { company } from '../../src/constants/data';
import { pathTraversalPayloads, sqliPayloads } from '../../src/constants/security';
import { assertSafeApiResponse } from '../../src/security/assertSafeApiResponse';

test('security 1 sqli search q', { tag: ['@security', '@api'] }, async ({ api }) => {
  for (const payload of sqliPayloads) {
    const response = await api.search({ q: payload, limit: 3 });
    await assertSafeApiResponse(response);
  }
});

test('security 2 sqli deals q and filters', { tag: ['@security', '@api'] }, async ({ api }) => {
  for (const payload of sqliPayloads) {
    await assertSafeApiResponse(await api.deals({ q: payload, limit: 3 }));
  }

  for (const payload of sqliPayloads) {
    await assertSafeApiResponse(await api.deals({ sector: payload, limit: 3 }));
    await assertSafeApiResponse(await api.deals({ country_code: payload, limit: 3 }));
  }
});

test('security 3 sqli path ids and numeric params', { tag: ['@security', '@api'] }, async ({ api }) => {
  for (const payload of pathTraversalPayloads) {
    await assertSafeApiResponse(await api.entity(payload));
    await assertSafeApiResponse(await api.node(payload));
    await assertSafeApiResponse(await api.deal(payload));
    await assertSafeApiResponse(await api.screening(payload));
    await assertSafeApiResponse(await api.country(payload));
  }

  for (const payload of sqliPayloads) {
    await assertSafeApiResponse(await api.portfolio({ limit: payload as unknown as number }));
    await assertSafeApiResponse(
      await api.ownershipChain(company.nodeId, { max_depth: payload as unknown as number }),
    );
  }

  // Smoke that a normal authenticated call still works after injection probes.
  expect((await api.me()).status()).toBe(200);
});
