import { test, expect } from '@playwright/test';

const SHARED_TOOLS: ReadonlyArray<readonly [string, string]> = [
  ['SC-001', '/weld-pro.html'],
  ['SC-010', '/labor-pro.html'],
  ['SC-012', '/quote-pro.html'],
  ['SC-020', '/machining-pro.html'],
  ['SC-021', '/bearing-pro.html'],
  ['SC-022', '/tap-thread-pro.html'],
  ['SC-023', '/cycle-cost-pro.html'],
  ['SC-024', '/bearing-freq-pro.html'],
  ['SC-025', '/belt-chain-pro.html'],
  ['SC-026', '/shaft-pro.html'],
  ['SC-027', '/fits-pro.html'],
  ['SC-028', '/surface-finish-pro.html'],
  ['SC-029', '/heat-input-pro.html'],
  ['SC-030', '/bend-pro.html'],
  ['SC-031', '/sling-pro.html'],
  ['SC-032', '/shackle-eyebolt-pro.html'],
  ['SC-033', '/pressure-vessel-pro.html'],
  ['SC-034', '/pipe-wall-pro.html'],
  ['SC-035', '/bolt-pro.html'],
  ['SC-036', '/bolted-joint-pro.html'],
  ['SC-037', '/oee-pro.html'],
  ['SC-038', '/machine-rate-pro.html'],
  ['SC-039', '/punching-pro.html'],
  ['SC-040', '/hydraulic-pro.html']
];

for (const [code, url] of SHARED_TOOLS) {
  test(`${code} renders the shared deterministic calculator surface`, async ({ page }) => {
    await page.goto(url);
    await expect(page.locator('#toolCode')).toHaveText(code);
    await expect(page.locator('#toolTitle')).not.toBeEmpty();
    await expect(page.locator('#fields input, #fields select').first()).toBeVisible();
    await expect(page.locator('#calcBtn')).toBeVisible();
    await expect(page.locator('#auditEngine')).toContainText(/Engine|SC\d+/i);
    await expect(page.locator('#auditFormulas')).not.toBeEmpty();
    await expect(page.locator('#auditAssumptions')).not.toBeEmpty();
    await expect(page.locator('#auditWarnings')).not.toBeEmpty();
  });
}

test('SC-008 retains its dedicated deterministic Monte Carlo surface', async ({ page }) => {
  await page.goto('/sc008-pro.html');
  await expect(page.locator('body')).toContainText(/Tolerance Stack-Up/i);
  await expect(page.locator('body')).toContainText(/Monte Carlo/i);
});

test('catalog only presents live tools', async ({ page }) => {
  await page.goto('/tools.html');
  await expect(page.locator('#catalog')).toContainText(/Bearing Life L10/i);
  await expect(page.locator('#catalog')).not.toContainText(/Regeneration pending/i);
  await expect(page.locator('#catalog')).not.toContainText(/True Labor Cost/i);
});

test('tools search narrows live as query grows', async ({ page }) => {
  await page.goto('/tools.html');
  await page.locator('#q').fill('b');
  await expect(page.locator('#suggest')).toBeVisible();
  const broad = await page.locator('#suggest .sg-item').count();
  expect(broad).toBeGreaterThan(1);
  await page.locator('#q').fill('bearing');
  await expect(page.locator('#suggest')).toContainText(/Bearing Life L10/i);
  const narrow = await page.locator('#suggest .sg-item').count();
  expect(narrow).toBeLessThanOrEqual(broad);
  await expect(page.locator('#catalog .catsec')).toHaveCount(1);
});

test('discovery files expose unified architecture and all-live catalog', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  const robotsText = await robots.text();
  expect(robotsText).toContain('User-agent: Googlebot');
  expect(robotsText).toContain('User-agent: Bingbot');
  expect(robotsText).toContain('User-agent: OAI-SearchBot');
  expect(robotsText).toContain('Sitemap: https://www.sectorcalc.com/sitemap.xml');

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  const sm = await sitemap.text();
  for (const [, url] of SHARED_TOOLS) expect(sm).toContain(url.slice(1));
  expect(sm).toContain('sc008-pro.html');
  expect(sm).toContain('tools.html');
  expect(sm).not.toContain('<priority>');
  expect(sm).not.toContain('<changefreq>');
  expect(sm).not.toContain('/categories');
  expect(sm).not.toContain('/developer-showcase');

  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  expect(locs).toHaveLength(29);
  expect(new Set(locs).size).toBe(locs.length);

  const llms = await request.get('/llms.txt');
  expect(llms.ok()).toBeTruthy();
  const llmsText = await llms.text();
  expect(llmsText).toContain('24 calculators use the schema-driven Decimal.js industrial runtime');
  expect(llmsText).toContain('A1-A5 Audit/Review');
  expect(llmsText).toContain('25 live, 0 planned');
  expect(llmsText).toContain('SC-008 Tolerance Stack-Up');
  expect(llmsText).toContain('OAI-SearchBot');

  const llm = await request.get('/llm.txt');
  expect(llm.ok()).toBeTruthy();
  const llmText = await llm.text();
  expect(llmText).toBe(llmsText);
  expect(llmText).toContain('SC-010 True Labor Cost');
  expect(llmText).toContain('SC-040 Hydraulic Cylinder Sizing');
  expect(llmText).toContain('deterministic input hash');
});
