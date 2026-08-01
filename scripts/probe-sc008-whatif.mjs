/**
 * Isolate the what-if cost: call SCStudy.loadSample() twice in a row.
 * First call warms cache, second should be much faster if the what-if
 * simulations are being cached. Also time generateReport indirectly.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(120000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(10000);

const r = await page.evaluate(() => {
  const w = window;
  const out = {};
  const t = () => performance.now();

  // Warm the cache explicitly first via loadSample.
  let s = t();
  w.SCStudy.loadSample();
  out.loadSample1 = Math.round(t() - s);

  s = t();
  w.SCStudy.loadSample();
  out.loadSample2 = Math.round(t() - s);

  s = t();
  w.SCStudy.loadSample();
  out.loadSample3 = Math.round(t() - s);

  // Now a real click event simulation (dispatch the click on #genReport).
  const btn = document.getElementById('genReport');
  s = t();
  btn.click();
  out.realClick = Math.round(t() - s);

  s = t();
  btn.click();
  out.realClick2 = Math.round(t() - s);

  return out;
});
console.log('WHAT-IF:', JSON.stringify(r));
await browser.close();
