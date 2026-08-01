import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
for (const slug of ['true-labor-cost', 'quote-pricing', 'tolerance-stack-up']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`https://sectorcalc.com/calculator/${slug}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(4000);
  const r = await page.evaluate(() => {
    const layout = document.querySelector('.sc-layout');
    const sidebar = document.querySelector('.sc-sidebar');
    const live = document.getElementById('liveResult');
    const report = document.getElementById('reportArea');
    const desc = (el, name) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { name, top: Math.round(r.top + window.scrollY), h: Math.round(r.height), w: Math.round(r.width), display: getComputedStyle(el).display, cls: el.className?.toString().slice(0, 40) };
    };
    return {
      layout: desc(layout, '.sc-layout'),
      sidebar: desc(sidebar, '.sc-sidebar'),
      liveResult: desc(live, '#liveResult'),
      reportArea: desc(report, '#reportArea'),
      gate: desc(document.querySelector('.sc-pro-gate'), '.sc-pro-gate'),
      // children of layout
      layoutChildren: layout ? Array.from(layout.children).map((c) => ({ tag: c.tagName, cls: (c.className || '').toString().slice(0, 30), top: Math.round(c.getBoundingClientRect().top + window.scrollY) })) : [],
      // parent chain of #liveResult
      liveChain: live ? (() => { const chain = []; let n = live; while (n && chain.length < 6) { chain.push((n.tagName || '') + '.' + (n.className?.toString?.() || '').slice(0, 25)); n = n.parentElement; } return chain; })() : null
    };
  });
  console.log(`=== ${slug} ===`);
  console.log(JSON.stringify(r, null, 1));
  await page.close();
}
await browser.close();
