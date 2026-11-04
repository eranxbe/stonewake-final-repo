import { test, expect } from '../../src/fixtures/test';
import { headings } from '../../src/constants/messages';
import { routes } from '../../src/constants/routes';

test('ui 6 sidebar', { tag: ['@ui', '@regression'] }, async ({ loggedInPage, appShell }) => {
  await appShell.goToModule('countries');
  await loggedInPage.waitForURL(`**${routes.countries}`);
  await expect(appShell.heading).toHaveText(headings.countries);

  await appShell.goToModule('entities');
  await loggedInPage.waitForURL(`**${routes.entities}`);
  await expect(appShell.heading).toHaveText(headings.institutions);

  await appShell.goToModule('portfolio');
  await loggedInPage.waitForURL(`**${routes.portfolio}`);
  await expect(appShell.heading).toHaveText(headings.portfolio);

  await appShell.goToNav(headings.monitoring, `**${routes.monitoring}`);
  await expect(appShell.heading).toHaveText(headings.monitoring);

  await appShell.goToNav(headings.screenings, `**${routes.screenings}`);
  await expect(appShell.heading).toHaveText(headings.screenings);

  await appShell.goToNav(headings.scoring, `**${routes.scoring}`);
  await expect(appShell.heading).toHaveText(headings.scoring);
});
