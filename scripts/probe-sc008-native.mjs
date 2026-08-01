/**
 * Isolate the native #genReport bubble handler: strip the bridge's document
 * capture click listeners, manually arm the pass flags, then click.
 * If generateReport's what-ifs are the 4.3s, the native click (with pass armed
 * + capture stripped) will still take seconds.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(120000);

await page.addInitScript(() => {
  const w = window;
  w.__capturedClickListeners = [];
  const origAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    if (type === 'click') {
      w.__capturedClickListeners.push({ node: this, fn, capture: !!opts || opts === true });
    }
    return origAdd.call(this, type, fn, opts);
  };
  w.__stripBridge = () => {
    const lists = w.__capturedClickListeners || [];
    for (const rec of lists) {
      if (rec.node === document) {
        try {
          rec.node.removeEventListener('click', rec.fn, rec.capture);
        } catch {}
      }
    }
    return w.__capturedClickListeners.length;
  };
});

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(10000);

const r = await page.evaluate(() => {
  const w = window;
  const out = {};
  const t = () => performance.now();

  // Warm the sim cache via direct loadSample first.
  w.SCStudy.loadSample();
  w.__scDemoCalcPass = true;
  w.__scDemoReportPass = true;

  // Strip bridge capture listeners so armLocalReportPass does NOT run.
  out.stripped = w.__stripBridge();

  // Native bubble only (bridge stripped, pass armed).
  let s = t();
  document.getElementById('genReport').click();
  out.nativeClickWithPass = Math.round(t() - s);

  // Restore pass flags off.
  w.__scDemoCalcPass = false;
  w.__scDemoReportPass = false;
  return out;
});
console.log('NATIVE-BUBBLE ISOLATION:', JSON.stringify(r));
await browser.close();
