import { test, expect } from '../../src/fixtures/test';
import { company } from '../../src/constants/data';
import { headings } from '../../src/constants/messages';

test('ui 13 company profile financing ownership', { tag: ['@ui', '@regression'] }, async ({
  loggedInPage,
  companyPage,
}) => {
  await companyPage.open(company.nodeId);
  await expect(companyPage.heading).toHaveText(company.name);
  await expect(companyPage.financing).toBeVisible();
  await expect(companyPage.ownershipChain).toBeVisible();
  await expect(loggedInPage.getByText(company.countryIso3 === 'GBR' ? 'United Kingdom' : company.countryIso3).first()).toBeVisible();
});
