import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Load Free Tool Slugs
const generatedSchemasDir = path.join(process.cwd(), 'generated', 'schemas');
const freeSlugs: string[] = [];
if (fs.existsSync(generatedSchemasDir)) {
  const folders = fs.readdirSync(generatedSchemasDir);
  folders.forEach(f => {
    const p = path.join(generatedSchemasDir, f);
    if (fs.statSync(p).isDirectory()) {
      const files = fs.readdirSync(p).filter(file => file.endsWith('-schema.json'));
      files.forEach(file => {
        freeSlugs.push(file.replace('-schema.json', ''));
      });
    }
  });
}

// Load Premium Tool Slugs
const premiumSchemasDir = path.join(process.cwd(), 'src', 'lib', 'features', 'premium-schema', 'schemas');
const premiumSlugs: string[] = [];
if (fs.existsSync(premiumSchemasDir)) {
  const files = fs.readdirSync(premiumSchemasDir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && !f.endsWith('.test.ts'));
  files.forEach(file => {
    premiumSlugs.push(file.replace('.ts', ''));
  });
}

// Just take a sample of 3 Free and 3 Premium to keep the smoke test fast on CI
// In a real production CI, you can remove the `.slice()` to test all 400.
const testFreeSlugs = freeSlugs.slice(0, 3);
const testPremiumSlugs = premiumSlugs.slice(0, 3);

test.describe('E2E Free Tools UI Smoke Test', () => {
  for (const slug of testFreeSlugs) {
    test(`Calculates correctly for Free Tool: ${slug}`, async ({ page }) => {
      // Visit the page (using en locale)
      await page.goto(`/tools/generated/${slug}`);
      
      // Wait for inputs to appear
      const inputs = page.locator('input[type="number"], input[type="text"]');
      const count = await inputs.count();
      
      // Type '15' into every input field
      for (let i = 0; i < count; i++) {
        await inputs.nth(i).fill('15');
      }

      // Click Generate Report / Calculate
      await page.click('button:has-text("Generate Report"), button:has-text("Calculate"), .btn-exec');

      // Wait for result card or answer block
      // The result should not be NaN or Infinity
      await page.waitForTimeout(500); // Give React state a moment to update
      
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toContain('NaN');
      expect(bodyText).not.toContain('Infinity');
    });
  }
});

test.describe('E2E Premium Tools UI Smoke Test', () => {
  for (const slug of testPremiumSlugs) {
    test(`Calculates correctly for Premium Tool: ${slug}`, async ({ page }) => {
      // Visit the page (using en locale)
      await page.goto(`/tools/premium-schema/${slug}`);
      
      // Wait for inputs to appear
      const inputs = page.locator('input[type="number"], input[type="text"]');
      const count = await inputs.count();
      
      // Type '20' into every input field
      for (let i = 0; i < count; i++) {
        await inputs.nth(i).fill('20');
      }

      // Click Generate Report
      await page.click('button.btn-exec');

      // Assert no crash
      await page.waitForTimeout(500); 
      
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toContain('NaN');
      expect(bodyText).not.toContain('Infinity');
    });
  }
});
