import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(150000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(8000);

const cdp = await page.context().newCDPSession(page);
await cdp.send('Profiler.enable');
await cdp.send('Profiler.start');

const t0 = Date.now();
await page.evaluate(() => {
  const btn = document.getElementById('genReport');
  btn && btn.click();
  return true;
});
console.log('click fired in', Date.now() - t0, 'ms (evaluate returned immediately; blocking continues)');

// wait for main thread to free up
await page.waitForFunction(() => {
  const start = performance.now();
  return new Promise((res) => requestAnimationFrame(() => res(performance.now() - start < 100)));
}, { timeout: 120000 });
console.log('main thread free after', Date.now() - t0, 'ms');

const { profile } = await cdp.send('Profiler.stop');
const nodes = new Map(profile.nodes.map((n) => [n.id, n]));
const samples = profile.samples || [];
const timeDeltas = profile.timeDeltas || [];
const selfTime = new Map();
for (let i = 0; i < samples.length; i++) {
  const id = samples[i];
  const dt = timeDeltas[i] || 0;
  selfTime.set(id, (selfTime.get(id) || 0) + dt);
}
const totals = [];
for (const [id, t] of selfTime) {
  const node = nodes.get(id);
  if (node && node.callFrame && node.callFrame.functionName) {
    totals.push({ name: node.callFrame.functionName, url: (node.callFrame.url || '').split('/').pop(), self: t });
  }
}
totals.sort((a, b) => b.self - a.self);
console.log('TOP SELF TIME (microseconds):');
for (const t of totals.slice(0, 20)) {
  console.log(`  ${(t.self / 1000).toFixed(0).padStart(8)}ms  ${t.name}  [${t.url}]`);
}

await browser.close();
