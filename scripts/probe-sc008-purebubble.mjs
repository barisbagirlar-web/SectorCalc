import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(150000);

// Capture ALL click capture-listener registrations, and provide a way to strip
// the demo-report bridge listener (it registers first at boot).
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
await page.waitForTimeout(6000);

// Strip ALL document-level click listeners (including bridge), then click.
const r = await page.evaluate(() => {
  const w = window;
  const stripped = w.__stripBridge();
  const t0 = performance.now();
  document.getElementById('genReport').click();
  const elapsed = Math.round(performance.now() - t0);
  const reportLen = document.getElementById('reportArea')?.innerHTML.length ?? 0;
  return { stripped, elapsed, reportLen };
});
console.log('PURE-BUBBLE click (bridge stripped):', JSON.stringify(r));

await browser.close();
