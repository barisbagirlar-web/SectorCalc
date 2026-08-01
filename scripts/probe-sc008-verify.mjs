/**
 * Post-fix verification for SC-008: click #genReport, verify the report
 * actually renders (verdict, KPI, live result, banner), and measure the click.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(30000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 25000 });
await page.waitForTimeout(6000);

const before = await page.evaluate(() => ({
  reportLen: document.getElementById('reportArea')?.innerHTML.length ?? 0,
  verdict: document.getElementById('verdict')?.textContent?.trim() ?? null,
  live: document.getElementById('liveResult')?.textContent ?? null,
  banner: !!document.querySelector('.sc-demo-report')
}));
console.log('BEFORE CLICK:', JSON.stringify(before));

const t0 = Date.now();
await page.locator('#genReport').click();
const clickMs = Date.now() - t0;

await page.waitForTimeout(1500);
const after = await page.evaluate(() => ({
  reportLen: document.getElementById('reportArea')?.innerHTML.length ?? 0,
  verdict: document.getElementById('verdict')?.textContent?.trim() ?? null,
  live: document.getElementById('liveResult')?.textContent ?? null,
  kpis: document.getElementById('kpis')?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 120) ?? null,
  banner: !!document.querySelector('.sc-demo-report'),
  reportTitle: document.querySelector('#reportArea .sc-report-title')?.textContent ?? null,
  whatIfCards: document.querySelectorAll('.sc-whatif-card').length,
  noNaN: !(document.getElementById('reportArea')?.textContent ?? '').includes('NaN')
}));
console.log('AFTER CLICK:', JSON.stringify(after));
console.log('CLICK MS:', clickMs);

await browser.close();
