import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(5000);
page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE-ERR:', m.text().slice(0, 200)); });
page.on('pageerror', (e) => console.log('PAGE-ERR:', String(e).slice(0, 200)));

const url = 'https://sectorcalc.com/calculator/tolerance-stack-up';
const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
console.log('HTTP:', resp?.status());
await page.waitForTimeout(3000);
console.log('baseline result:', await page.evaluate(() => {
  const el = document.querySelector('#reportArea, #liveResult, #verdict');
  return el ? el.textContent.trim().slice(0, 80) : 'NONE';
}));

// Only test on the FIRST visible numeric input, with a hard per-case timeout.
const firstInput = await page.evaluate(() => {
  const el = Array.from(document.querySelectorAll('input')).find((i) => {
    const t = i.getAttribute('type');
    if (t && ['hidden', 'submit', 'button'].includes(t)) return false;
    const cs = getComputedStyle(i);
    return cs.display !== 'none' && i.getBoundingClientRect().height > 0;
  });
  return el ? el.id : null;
});
console.log('first input:', firstInput);

const tests = [
  ['zero', '0'],
  ['negative', '-999'],
  ['nan', 'NaN'],
  ['inf', '1e308'],
  ['huge', '999999999999'],
  ['tiny', '0.000001'],
  ['string', 'abc'],
  ['script', '<img src=x onerror=alert(1)>']
];

for (const [label, val] of tests) {
  const t0 = Date.now();
  let injected = false;
  try {
    const r = await page.evaluate(
      ([sel, v]) => {
        const el = document.getElementById(sel);
        if (!el) return false;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
      },
      [firstInput, val]
    );
    injected = r;
  } catch (e) {
    console.log(`INJECT-FAIL ${label}:`, String(e).slice(0, 120));
  }
  const elapsed = Date.now() - t0;
  console.log(`case=${label} injected=${injected} elapsed=${elapsed}ms`);
  // give the engine up to 3s to settle; if it hangs, we catch it
  await page.waitForTimeout(1500);
  const alive = await page.evaluate(() => ({ title: document.title.slice(0, 40) })).catch((e) => ({ title: 'DEAD: ' + String(e).slice(0, 60) }));
  console.log(`  after=${JSON.stringify(alive)}`);
  if (alive.title && alive.title.startsWith('DEAD')) {
    console.log(`HANG DETECTED on case ${label}`);
    break;
  }
  // restore sane value
  await page.evaluate(
    ([sel]) => {
      const el = document.getElementById(sel);
      if (el) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, '0.150');
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    },
    [firstInput]
  );
}
await browser.close();
