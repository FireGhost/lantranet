import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/playwright',
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: "never" }],
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: "http://localhost:3000",
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: "http://localhost:3001",
      },
    },

    // The app is not working on Safari for now...
//    {
//      name: 'webkit',
//      use: {
//        ...devices['Desktop Safari'],
//        baseURL: "http://localhost:3002",
//      },
//    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      //command: 'npm run build && npx prisma migrate deploy && npm run preview',
      command: 'npx prisma migrate deploy && npm run preview',
      url: 'http://localhost:3000',
      env: {
        "PORT": "3000",
        "APP_DB_URL": "file:/tmp/chromium-app.db",
        "NUXT_SESSION_PASSWORD": "o8szdmfgos9d8zmfgo9s8dmzfg98mza0e89dzmawe90e78f7zm",
      },
      timeout: 120000,
    },
    {
      command: 'npx prisma migrate deploy && npm run preview',
      url: 'http://localhost:3001',
      env: {
        "PORT": "3001",
        "APP_DB_URL": "file:/tmp/firefox-app.db",
        "NUXT_SESSION_PASSWORD": "kajsdhffgos9d8zmfgo9s8dmzfg98mza0e89dzmawe90e78f7zm",
      },
    },
//    {
//      command: 'npx prisma migrate deploy && npm run preview',
//      url: 'http://localhost:3002',
//      env: {
//        "PORT": "3002",
//        "APP_DB_URL": "file:/tmp/webkit-app.db",
//        "NUXT_SESSION_PASSWORD": "dfv7jmfgos9d8zmfgo9s8dmzfg98mza0e89dzmawe90e78f7zm",
//      },
//    },
  ],
});
