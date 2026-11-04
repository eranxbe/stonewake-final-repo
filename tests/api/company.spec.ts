import { test, expect } from '../../src/fixtures/test';
import { company } from '../../src/constants/data';

test('api 14 company profile financing ownership', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const companyResponse = await api.nodeCompany(company.nodeId);
  expect(companyResponse.status()).toBe(200);

  const companyJson = await companyResponse.json();
  expect(companyJson.node_id).toBe(company.nodeId);
  expect(companyJson.name).toBe(company.name);
  expect(Array.isArray(companyJson.identity)).toBe(true);
  expect(companyJson.identity.length).toBeGreaterThanOrEqual(1);

  const financingResponse = await api.nodeFinancing(company.nodeId);
  expect(financingResponse.status()).toBe(200);

  const financingJson = await financingResponse.json();
  expect(financingJson.node_id).toBe(company.nodeId);
  expect(Array.isArray(financingJson.charges)).toBe(true);
  expect(Array.isArray(financingJson.instruments)).toBe(true);
  expect(financingJson.instruments.length).toBeGreaterThanOrEqual(1);

  for (const instrument of financingJson.instruments.slice(0, 2)) {
    expect(typeof instrument.isin).toBe('string');
    expect(Array.isArray(instrument.citations)).toBe(true);
  }

  const ownershipResponse = await api.ownershipChain(company.nodeId, { max_depth: 2 });
  expect(ownershipResponse.status()).toBe(200);

  const ownershipJson = await ownershipResponse.json();
  expect(ownershipJson.root_id).toBe(company.nodeId);
  expect(Array.isArray(ownershipJson.nodes)).toBe(true);
  expect(Array.isArray(ownershipJson.paths)).toBe(true);
  expect(ownershipJson.params.max_depth).toBe(2);
});
