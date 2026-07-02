# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tools-smoke.spec.ts >> E2E Premium Tools UI Smoke Test >> Calculates correctly for Premium Tool: 3d-printing-batch-optimization-nesting-calculator
- Location: e2e/tools-smoke.spec.ts:67:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button.btn-exec')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e12]:
    - heading "404 - Page Not Found" [level=1] [ref=e13]
    - paragraph [ref=e14]: The page you are looking for does not exist.
    - link "Go to Homepage" [ref=e15] [cursor=pointer]:
      - /url: /
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import * as fs from 'fs';
  3  | import * as path from 'path';
  4  | 
  5  | // Load Free Tool Slugs
  6  | const generatedSchemasDir = path.join(process.cwd(), 'generated', 'schemas');
  7  | let freeSlugs: string[] = [];
  8  | if (fs.existsSync(generatedSchemasDir)) {
  9  |   const folders = fs.readdirSync(generatedSchemasDir);
  10 |   folders.forEach(f => {
  11 |     const p = path.join(generatedSchemasDir, f);
  12 |     if (fs.statSync(p).isDirectory()) {
  13 |       const files = fs.readdirSync(p).filter(file => file.endsWith('-schema.json'));
  14 |       files.forEach(file => {
  15 |         freeSlugs.push(file.replace('-schema.json', ''));
  16 |       });
  17 |     }
  18 |   });
  19 | }
  20 | 
  21 | // Load Premium Tool Slugs
  22 | const premiumSchemasDir = path.join(process.cwd(), 'src', 'lib', 'features', 'premium-schema', 'schemas');
  23 | let premiumSlugs: string[] = [];
  24 | if (fs.existsSync(premiumSchemasDir)) {
  25 |   const files = fs.readdirSync(premiumSchemasDir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && !f.endsWith('.test.ts'));
  26 |   files.forEach(file => {
  27 |     premiumSlugs.push(file.replace('.ts', ''));
  28 |   });
  29 | }
  30 | 
  31 | // Just take a sample of 3 Free and 3 Premium to keep the smoke test fast on CI
  32 | // In a real production CI, you can remove the `.slice()` to test all 400.
  33 | const testFreeSlugs = freeSlugs.slice(0, 3);
  34 | const testPremiumSlugs = premiumSlugs.slice(0, 3);
  35 | 
  36 | test.describe('E2E Free Tools UI Smoke Test', () => {
  37 |   for (const slug of testFreeSlugs) {
  38 |     test(`Calculates correctly for Free Tool: ${slug}`, async ({ page }) => {
  39 |       // Visit the page (using en locale)
  40 |       await page.goto(`/tools/generated/${slug}`);
  41 |       
  42 |       // Wait for inputs to appear
  43 |       const inputs = page.locator('input[type="number"], input[type="text"]');
  44 |       const count = await inputs.count();
  45 |       
  46 |       // Type '15' into every input field
  47 |       for (let i = 0; i < count; i++) {
  48 |         await inputs.nth(i).fill('15');
  49 |       }
  50 | 
  51 |       // Click Generate Report / Calculate
  52 |       await page.click('button:has-text("Generate Report"), button:has-text("Calculate"), .btn-exec');
  53 | 
  54 |       // Wait for result card or answer block
  55 |       // The result should not be NaN or Infinity
  56 |       await page.waitForTimeout(500); // Give React state a moment to update
  57 |       
  58 |       const bodyText = await page.locator('body').innerText();
  59 |       expect(bodyText).not.toContain('NaN');
  60 |       expect(bodyText).not.toContain('Infinity');
  61 |     });
  62 |   }
  63 | });
  64 | 
  65 | test.describe('E2E Premium Tools UI Smoke Test', () => {
  66 |   for (const slug of testPremiumSlugs) {
  67 |     test(`Calculates correctly for Premium Tool: ${slug}`, async ({ page }) => {
  68 |       // Visit the page (using en locale)
  69 |       await page.goto(`/tools/premium-schema/${slug}`);
  70 |       
  71 |       // Wait for inputs to appear
  72 |       const inputs = page.locator('input[type="number"], input[type="text"]');
  73 |       const count = await inputs.count();
  74 |       
  75 |       // Type '20' into every input field
  76 |       for (let i = 0; i < count; i++) {
  77 |         await inputs.nth(i).fill('20');
  78 |       }
  79 | 
  80 |       // Click Generate Report
> 81 |       await page.click('button.btn-exec');
     |                  ^ Error: page.click: Test timeout of 30000ms exceeded.
  82 | 
  83 |       // Assert no crash
  84 |       await page.waitForTimeout(500); 
  85 |       
  86 |       const bodyText = await page.locator('body').innerText();
  87 |       expect(bodyText).not.toContain('NaN');
  88 |       expect(bodyText).not.toContain('Infinity');
  89 |     });
  90 |   }
  91 | });
  92 | 
```