import { test, expect } from '../../src/fixtures/test';
import { country, search } from '../../src/constants/data';
import { headings, titles } from '../../src/constants/messages';

test('ui 8 countries', { tag: ['@ui', '@regression'] }, async ({
  loggedInPage,
  countriesPage,
  countryDetailPage,
}) => {
  await countriesPage.open();
  await expect(countriesPage.heading).toHaveText(headings.countries);

  await countriesPage.searchCountries(country.name);
  await expect(countriesPage.countryLink(country.iso3)).toBeVisible();
  await countriesPage.openCountry(country.iso3);
  await expect(countryDetailPage.heading).toHaveText(country.name);
  await expect(countryDetailPage.risk).toBeVisible();
  await expect(countryDetailPage.dataSources).toBeVisible();

  await countriesPage.open();
  await countriesPage.searchCountries(search.noCountries);
  await expect(countriesPage.noMatches).toBeVisible();
  await expect(countriesPage.countryLinks).toHaveCount(0);

  await countryDetailPage.open(country.invalidIso3);
  await expect(loggedInPage).toHaveTitle(titles.notFound);
});

test('ui 20 countries excel and report export', { tag: ['@ui', '@regression'] }, async ({
  loggedInPage,
  countriesPage,
  countryDetailPage,
}) => {
  await countriesPage.open();
  const workbook = await countriesPage.exportWorkbook();
  expect(workbook.suggestedFilename()).toMatch(/\.xlsx$/i);

  await countryDetailPage.open(country.iso3);
  await expect(countryDetailPage.downloadReport).toBeVisible();
  const report = await countryDetailPage.downloadCountryReport();
  expect(report.suggestedFilename()).toMatch(/\.pdf$/i);
});
