import { test, expect } from '../../src/fixtures/test';
import { institution } from '../../src/constants/data';
import { headings, titles } from '../../src/constants/messages';

test('ui 9 institutions', { tag: ['@ui', '@regression'] }, async ({ loggedInPage, institutionsPage }) => {
  await institutionsPage.open();
  await expect(institutionsPage.heading).toHaveText(headings.institutions);
  await expect(institutionsPage.kind).toBeVisible();
  await expect(institutionsPage.country).toBeVisible();

  await institutionsPage.searchInstitutions(institution.query);
  await expect(institutionsPage.entityLink(institution.id)).toContainText(institution.name);
  await expect(institutionsPage.entityLinks).toHaveCount(1);

  await institutionsPage.openEntity(institution.id);
  await expect(loggedInPage).toHaveTitle(titles.institutions);
  await expect(institutionsPage.heading).toBeVisible();
});
