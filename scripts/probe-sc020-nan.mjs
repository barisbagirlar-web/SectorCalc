/**
 * Real user simulation: type hostile numbers via the keyboard into SC-020.
 * Mirrors what a real user can actually do in type=number fields.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(15000);

const url = 'https://sectorcalc.com/calculator/cnc-feeds-speeds';
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(4000);

const TESTS = [
  ['D', '0'],
  ['D', '-999'],
  ['z', '1e308'],
  ['L', '999999999999'],
  ['L', '0.000001']
];

const kpiText = async () => {
  const kpi = await page.locator('#kpis').textContent().catch(() => '');
  return (kpi || '').replace(/\s+/g, ' ').trim().slice(0, 140);
};

for (const [id, val] of TESTS) {
  const input = page.locator(`#${id}`);
  try {
    await input.click();
    await page.keyboard.press('Meta+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(val, { delay: 20 });
    await input.press('Enter');
    await page.waitForTimeout(1000);
  } catch (e) {
    console.log(`${id}=${val} TYPE-FAILED ${String(e).slice(0, 70)}`);
    continue;
  }
  const kpi = await kpiText();
  const bad = /NaN|Infinity|undefined|null/.test(kpi);
  console.log(`${bad ? 'NaN!' : 'ok  '} ${id}=${val.padEnd(14)} kpi=${kpi} ${bad ? '<<< NaN/INF' : ''}`);
}

await browser.close();
