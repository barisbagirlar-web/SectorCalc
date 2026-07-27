import { defineConfig, devices } from '@playwright/test';

/**
 * SectorCalc Enterprise Regression Guard — Playwright
 *
 * Modes:
 *   Local (default)     → Vite :5173 + Firebase rewrite/redirect parity
 *   Preview / Live      → BASE_URL=https://… (no webServer)
 *
 * Tags (use --grep):
 *   @critical  commerce, auth, free, gate, seo, nav
 *   @matrix    all 25 calculators
 *   @a11y      accessibility smoke
 *   @visual    screenshot contracts (REGRESSION_VISUAL=1)
 *   @deep      engine compute paths (tools.smoke)
 */
const baseURL = process.env.BASE_URL || 'http://localhost:5173';
const againstRemote = Boolean(process.env.BASE_URL);
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['**/suites/**/*.spec.ts', '**/tools.smoke.spec.ts'],
  timeout: 60_000,
  expect: { timeout: 12_000 },
  fullyParallel: !againstRemote,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ...(isCI
      ? ([['junit', { outputFile: 'test-results/junit-e2e.xml' }], ['github']] as const)
      : [])
  ],
  use: {
    baseURL,
    headless: true,
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    ...(process.env.REGRESSION_MOBILE === '1'
      ? [
          {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 5'] },
            grep: /@critical|@nav|@commerce|@auth/
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
          reuseExistingServer: !isCI,
          timeout: 120_000
        }
      })
});
