/**
 * Find the 4.3s: measure __scProGate.ensureEntitled() (bridge override) and
 * the native #genReport listener in isolation, plus a raw click.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(120000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(10000);

const r = await page.evaluate(async () => {
  const w = window;
  const out = {};
  const t = () => performance.now();

  out.hasGate = !!w.__scProGate;
  if (w.__scProGate) {
    let s = t();
    const entitled = await w.__scProGate.ensureEntitled();
    out.ensureEntitledMs = Math.round(t() - s);
    out.entitled = entitled;
  }

  // Bridge override check: pass flags off right now (bridge resets them), so
  // this should reflect real entitlement flow.
  out.demoCalc = w.__scDemoCalcPass;
  out.demoReport = w.__scDemoReportPass;

  return out;
});
console.log('GATE:', JSON.stringify(r));
await browser.close();
