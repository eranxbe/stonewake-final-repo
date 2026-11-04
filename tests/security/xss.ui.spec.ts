import { test, expect } from '../../src/fixtures/test';
import { xssPayloads } from '../../src/constants/security';
import { assertPayloadNotExecuted, watchForXssDialogs } from '../../src/security/assertNoXss';

test('security 9 xss ui deal search', { tag: ['@security', '@ui'] }, async ({
  loggedInPage,
  dealBookPage,
}) => {
  const stopWatch = watchForXssDialogs(loggedInPage);
  try {
    await dealBookPage.open();
    for (const payload of xssPayloads) {
      await dealBookPage.searchDeals(payload);
      await expect(dealBookPage.search).toHaveValue(payload);
      await assertPayloadNotExecuted(loggedInPage, payload);
      await expect(dealBookPage.heading).toBeVisible();
      await dealBookPage.clearSearch();
    }
  } finally {
    stopWatch();
  }
});

test('security 10 xss ui country search', { tag: ['@security', '@ui'] }, async ({
  loggedInPage,
  countriesPage,
}) => {
  const stopWatch = watchForXssDialogs(loggedInPage);
  try {
    await countriesPage.open();
    for (const payload of xssPayloads) {
      await countriesPage.searchCountries(payload);
      await expect(countriesPage.search).toHaveValue(payload);
      await assertPayloadNotExecuted(loggedInPage, payload);
      await expect(countriesPage.heading).toBeVisible();
    }
  } finally {
    stopWatch();
  }
});

test('security 11 xss ui institution search', { tag: ['@security', '@ui'] }, async ({
  loggedInPage,
  institutionsPage,
}) => {
  const stopWatch = watchForXssDialogs(loggedInPage);
  try {
    await institutionsPage.open();
    for (const payload of xssPayloads) {
      await institutionsPage.searchInstitutions(payload);
      await expect(institutionsPage.search).toHaveValue(payload);
      await assertPayloadNotExecuted(loggedInPage, payload);
      await expect(institutionsPage.heading).toBeVisible();
    }
  } finally {
    stopWatch();
  }
});
