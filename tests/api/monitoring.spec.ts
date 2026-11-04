import { test, expect } from '../../src/fixtures/test';
import { portfolioStatuses } from '../../src/constants/data';

test('api 15 monitoring targets and portfolio updates', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const targetsResponse = await api.monitoringTargets({ limit: 5 });
  expect(targetsResponse.status()).toBe(200);

  const targetsJson = await targetsResponse.json();
  expect(Array.isArray(targetsJson.items)).toBe(true);
  expect(targetsJson.limit).toBe(5);
  expect(Number.isInteger(targetsJson.total)).toBe(true);

  const transitionsResponse = await api.portfolioTransitions({ limit: 3 });
  expect(transitionsResponse.status()).toBe(200);

  const transitionsJson = await transitionsResponse.json();
  expect(Array.isArray(transitionsJson.items)).toBe(true);
  expect(transitionsJson.items.length).toBeGreaterThanOrEqual(1);
  expect(transitionsJson.items.length).toBeLessThanOrEqual(3);

  for (const transition of transitionsJson.items) {
    expect(typeof transition.exposure_id).toBe('number');
    expect(typeof transition.node_id).toBe('number');
    expect(typeof transition.label).toBe('string');
    expect(portfolioStatuses).toContain(transition.to_status);
    expect(typeof transition.occurred_at).toBe('string');
    expect(typeof transition.cause?.kind).toBe('string');
  }

  expect((await api.monitoringTargets(undefined, 'none')).status()).toBe(401);
  expect((await api.portfolioTransitions(undefined, 'none')).status()).toBe(401);
});
