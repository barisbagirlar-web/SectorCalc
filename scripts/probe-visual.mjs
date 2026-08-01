import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
for (const slug of ['true-labor-cost', 'quote-pricing', 'tolerance-stack-up']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`https://sectorcalc.com/calculator/${slug}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `/tmp/${slug}-anon.png` });
  const r = await page.evaluate(() => {
    const sidebar = document.querySelector('.sc-sidebar');
    const result = document.getElementById('reportArea, liveResult') || document.querySelector('#reportArea');
    const grid = document.querySelector('.grid, .sc-layout');
    const inputs = Array.from(document.querySelectorAll('input, select')).filter((el) => {
      const t = el.getAttribute('type');
      if (t && ['hidden', 'submit', 'button'].includes(t)) return false;
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return !(cs.display === 'none' || cs.visibility === 'hidden' || rect.height === 0);
    });
    return {
      sidebar: sidebar ? { top: Math.round(sidebar.getBoundingClientRect().top), h: Math.round(sidebar.getBoundingClientRect().height) } : null,
      grid: grid ? { top: Math.round(grid.getBoundingClientRect().top), h: Math.round(grid.getBoundingClientRect().height), cls: grid.className.slice(0, 30) } : null,
      visibleInputs: inputs.length,
      firstInputTop: inputs.length ? Math.round(inputs[0].getBoundingClientRect().top) : null,
      report: result ? { top: Math.round(result.getBoundingClientRect().top), visible: result.getBoundingClientRect().height > 0 } : null,
      demoLocked: document.body.classList.contains('sc-demo-locked'),
      gate: document.querySelector('.sc-pro-gate') ? document.querySelector('.sc-pro-gate').textContent.replace(/\s+/g, ' ').slice(0, 80) : null
    };
  });
  console.log(`\n=== ${slug} ===\n` + JSON.stringify(r, null, 1));
  await page.close();
}
await browser.close();
