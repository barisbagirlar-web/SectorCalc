/**
 * Verify SC-008 debounce + click performance live:
 * - typing a new value should NOT block the main thread per keystroke (debounce)
 * - #genReport click stays < 2s
 * - banner + report still render
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(30000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 25000 });
await page.waitForTimeout(6000);

// Measure main-thread block per keystroke while typing a fresh value.
const input = page.locator('#specUpper');
await input.click();
const blockPerKey = await page.evaluate(() => {
  return new Promise((resolve) => {
    const results = [];
    const inp = document.getElementById('specUpper');
    inp.focus();
    const measure = () => {
      const before = performance.now();
      requestAnimationFrame(() => {
        results.push(Math.round(performance.now() - before));
      });
    };
    // Simulate 4 rapid keystrokes via input events (what a real user types).
    const keys = ['1', '2', '.', '5'];
    let i = 0;
    const timer = setInterval(() => {
      if (i >= keys.length) {
        clearInterval(timer);
        setTimeout(() => resolve({ results, total: results.reduce((a, b) => a + b, 0) }), 3000);
        return;
      }
      inp.value += keys[i];
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      measure();
      i++;
    }, 60);
  });
});
console.log('KEYSTROKE blocks (ms/frame):', JSON.stringify(blockPerKey));

await page.waitForTimeout(2500);
const liveAfterType = await page.evaluate(() => ({
  live: document.getElementById('liveResult')?.textContent ?? null,
  sub: document.getElementById('liveSub')?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 60) ?? null,
  reportLen: document.getElementById('reportArea')?.innerHTML.length ?? 0,
  banner: !!document.querySelector('.sc-demo-report')
}));
console.log('AFTER TYPING:', JSON.stringify(liveAfterType));

// Reset then click generate.
await page.evaluate(() => {
  window.__scDemoCalcPass = true;
  document.getElementById('specUpper').value = '0.15';
  document.getElementById('specUpper').dispatchEvent(new Event('input', { bubbles: true }));
  window.__scDemoCalcPass = false;
});
await page.waitForTimeout(2000);

const t0 = Date.now();
await page.locator('#genReport').click();
console.log('CLICK MS:', Date.now() - t0);
await page.waitForTimeout(1500);
const after = await page.evaluate(() => ({
  reportLen: document.getElementById('reportArea')?.innerHTML.length ?? 0,
  title: document.querySelector('#reportArea .sc-report-title')?.textContent ?? null,
  whatIf: document.querySelectorAll('.sc-whatif-card').length,
  banner: !!document.querySelector('.sc-demo-report'),
  noNaN: !(document.getElementById('reportArea')?.textContent ?? '').includes('NaN')
}));
console.log('AFTER CLICK:', JSON.stringify(after));

await browser.close();
