import { defineConfig } from '@playwright/test';

/**
 * E2E visual smoke against the Vite dev server.
 * Specs live in tests/e2e as *.spec.ts so Vitest (*.test.ts) never picks them up.
 */
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  timeout: 30000,
  fullyParallel: false,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
    timeout: 60000
  }
});
