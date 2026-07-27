import { defineConfig, devices } from '@playwright/test';

/**
 * SectorCalc Regression Guard — Playwright Config
 * Stack: Lit + Vite + Firebase Hosting + Paddle
 *
 * Modes:
 * - Local (default): Vite dev server on :5173
 * - Production / preview: set BASE_URL (skips webServer)
 *
 * Specs live in tests/e2e as *.spec.ts so Vitest (*.test.ts) never picks them up.
 */
const baseURL = process.env.BASE_URL || 'http://localhost:5173';
const againstRemote = Boolean(process.env.BASE_URL);

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  timeout: 45_000,
  fullyParallel: !againstRemote,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    ...(againstRemote
      ? [
          {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] }
          }
        ]
      : [])
  ],
  ...(againstRemote
    ? {}
    : {
        webServer: {
          command: 'npm run dev',
          port: 5173,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000
        }
      })
});
