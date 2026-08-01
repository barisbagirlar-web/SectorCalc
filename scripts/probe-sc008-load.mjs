import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(30000);

const navStart = Date.now();
await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
const tDom = Date.now() - navStart;
console.log('domcontentloaded:', tDom, 'ms');

// First frame after load — how long does main thread take to free up?
const frameInfo = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const start = performance.now();
      requestAnimationFrame((t) => {
        resolve({ firstRaf: Math.round(t - start), wallStart: Math.round(start) });
      });
    })
);
console.log('first idle frame after evaluate:', JSON.stringify(frameInfo));

// Now time how long the page is truly interactive: wait until a rAF runs within 50ms
// of the previous one (main thread free).
const idleInfo = await page.evaluate(
  () =>
    new Promise((resolve) => {
      let prev = performance.now();
      let samples = 0;
      let maxGap = 0;
      const check = () => {
        const now = performance.now();
        const gap = now - prev;
        prev = now;
        samples++;
        if (gap > maxGap) maxGap = gap;
        if (samples > 10) {
          resolve({ maxGapMs: Math.round(maxGap), samples });
          return;
        }
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    })
);
console.log('idle gaps (main thread free?):', JSON.stringify(idleInfo));

await browser.close();
