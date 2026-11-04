import { defineConfig, devices } from '@playwright/test';

const { loadRunConfig } = require('./scripts/load-config');

const runConfig = loadRunConfig({
  env: process.env.TEST_ENV,
  suite: process.env.TEST_SUITE,
  type: process.env.TEST_TYPE,
  headed: process.env.TEST_HEADED === '1' ? true : undefined,
});

const deviceByBrowser: Record<string, (typeof devices)[string]> = {
  chromium: devices['Desktop Chrome'],
  firefox: devices['Desktop Firefox'],
  webkit: devices['Desktop Safari'],
};

const browsers: string[] = runConfig.browsers || ['chromium'];
const uiProjects = browsers.map((browser) => {
  const device = deviceByBrowser[browser];
  if (!device) {
    throw new Error(`Unsupported browser in config: ${browser}`);
  }
  return {
    name: `ui-${browser}`,
    testMatch: /ui\/.*\.spec\.ts/,
    use: {
      ...device,
      baseURL: process.env.STONEWAKE_APP_URL,
    },
  };
});

export default defineConfig({
  testDir: './tests',
  timeout: runConfig.timeoutMs ?? 30000,
  workers: runConfig.workers ?? 2,
  retries: runConfig.retries ?? 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: !runConfig.headed,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    ...uiProjects,
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/,
      use: {
        baseURL: process.env.STONEWAKE_API_URL,
      },
    },
  ],
});
