import { test, expect } from '../../src/fixtures/test';
import { company, institutionEntityId } from '../../src/constants/data';

test('api 18 document downloads', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const dealsJson = await (await api.deals({ limit: 1 })).json();
  const dealId = dealsJson.items[0].deal_id;

  const dealPack = await api.dealPackPdf(dealId);
  expect(dealPack.status()).toBe(200);
  expect(dealPack.headers()['content-type']).toContain('application/pdf');
  expect((await dealPack.body()).byteLength).toBeGreaterThan(1000);

  const dealDeck = await api.dealDeckPptx(dealId);
  expect(dealDeck.status()).toBe(200);
  expect(dealDeck.headers()['content-type']).toContain(
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  );
  expect((await dealDeck.body()).byteLength).toBeGreaterThan(1000);

  const entityReport = await api.entityReportPdf(institutionEntityId);
  expect(entityReport.status()).toBe(200);
  expect(entityReport.headers()['content-type']).toContain('application/pdf');
  expect((await entityReport.body()).byteLength).toBeGreaterThan(1000);

  const entityPack = await api.entityPackPdf(institutionEntityId);
  expect([200, 404]).toContain(entityPack.status());
  if (entityPack.status() === 200) {
    expect(entityPack.headers()['content-type']).toContain('application/pdf');
    expect((await entityPack.body()).byteLength).toBeGreaterThan(1000);
  }

  const profile = await api.nodeProfilePdf(company.nodeId);
  expect(profile.status()).toBe(200);
  expect(profile.headers()['content-type']).toContain('application/pdf');
  expect((await profile.body()).byteLength).toBeGreaterThan(1000);

  const riskDeck = await api.nodeRiskDeckPptx(company.nodeId);
  expect([200, 404]).toContain(riskDeck.status());
  if (riskDeck.status() === 200) {
    expect(riskDeck.headers()['content-type']).toContain(
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    );
    expect((await riskDeck.body()).byteLength).toBeGreaterThan(1000);
  }

  expect((await api.dealPackPdf('does-not-exist-deal')).status()).toBe(404);
  expect((await api.nodeProfilePdf(999999999)).status()).toBe(404);
  expect((await api.dealDeckPptx(dealId, 'none')).status()).toBe(401);
});
