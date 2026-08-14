import { test, expect } from '@playwright/test';

/**
 * Homepage slim hero mandate 2026-08-15.
 * Guards mobile height, first-viewport CTAs, 900px columns, touch targets, copy, hrefs.
 */
function lum(hex: string): number {
  const m = hex.replace('#', '');
  const n =
    m.length === 3
      ? m.split('').map((c) => parseInt(c + c, 16))
      : [m.slice(0, 2), m.slice(2, 4), m.slice(4, 6)].map((c) => parseInt(c, 16));
  const [r, g, b] = n.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg: string, bg: string): number {
  const L1 = lum(fg);
  const L2 = lum(bg);
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

function rgbToHex(rgb: string): string {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return '#000000';
  return '#' + [m[1], m[2], m[3]].map((x) => Number(x).toString(16).padStart(2, '0')).join('');
}

test.describe('Homepage slim hero @critical', () => {
  test('375px: height, first-viewport CTAs, copy, hrefs, touch, contrast', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const r = await page.evaluate(() => {
      const hero = document.querySelector('.sc-hero') as HTMLElement | null;
      const cta1 = document.querySelector('.sc-hero-btn-b') as HTMLElement | null;
      const cta2 = document.querySelector('.sc-hero-btn-o') as HTMLElement | null;
      const live = document.querySelector('.sc-hero-live') as HTMLElement | null;
      const mini = document.querySelector('.sc-hero-mini') as HTMLElement | null;
      const vh = window.innerHeight;
      const box = (el: HTMLElement | null) => {
        if (!el) return null;
        const cs = getComputedStyle(el);
        const b = el.getBoundingClientRect();
        return {
          top: b.top,
          bottom: b.bottom,
          height: b.height,
          width: b.width,
          color: cs.color,
          bg: cs.backgroundColor,
          display: cs.display
        };
      };
      const grid = document.querySelector('.sc-hero .hero-grid') as HTMLElement | null;
      return {
        heroH: hero ? Math.round(hero.getBoundingClientRect().height) : -1,
        vh,
        cta1: box(cta1),
        cta2: box(cta2),
        live: box(live),
        mini: box(mini),
        cols: grid ? getComputedStyle(grid).gridTemplateColumns : '',
        hrefs: {
          cta1: cta1?.getAttribute('href'),
          cta2: cta2?.getAttribute('href'),
          live: live?.getAttribute('href')
        },
        copy: hero?.innerText || '',
        stage: !!document.getElementById('stage'),
        preview: (hero?.innerText || '').includes('PREVIEW'),
        repro: (hero?.innerText || '').includes('REPRODUCIBLE')
      };
    });

    expect(r.stage).toBe(false);
    expect(r.heroH).toBeGreaterThan(200);
    expect(r.heroH).toBeLessThanOrEqual(1500);
    expect(r.cta1 && r.cta1.bottom <= r.vh + 1).toBeTruthy();
    expect(r.cta2 && r.cta2.bottom <= r.vh + 1).toBeTruthy();
    expect(r.cta1 && r.cta1.height).toBeGreaterThanOrEqual(44);
    expect(r.cta2 && r.cta2.height).toBeGreaterThanOrEqual(44);
    expect(r.live && r.live.height).toBeGreaterThanOrEqual(44);
    expect(r.hrefs.cta1).toBe('#free-calculators');
    expect(r.hrefs.cta2).toBe('/pricing.html');
    expect(r.hrefs.live).toBe('/calculator/tolerance-stack-up');
    expect(r.preview).toBe(true);
    expect(r.repro).toBe(true);
    expect(r.copy).toContain('The Machine Is Running.');
    expect(r.copy).toContain('The Math Is Yours.');
    expect(r.copy).toContain('Five reference instruments run open');
    expect(r.copy).toContain('±0.0767 mm');
    expect(r.copy).toContain('v3.1.0');
    expect(r.copy).toContain('0x7A3F1C9E');
    expect(r.cols.split(' ').filter(Boolean).length).toBe(1);

    const colors = await page.evaluate(() => {
      const mini = document.querySelector('.sc-hero-mini') as HTMLElement | null;
      const opaqueBg = (el: HTMLElement | null): string => {
        let n: HTMLElement | null = el;
        while (n) {
          const bg = getComputedStyle(n).backgroundColor;
          const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (m && (m[4] === undefined || Number(m[4]) >= 0.99)) return bg;
          n = n.parentElement;
        }
        return getComputedStyle(document.documentElement).backgroundColor;
      };
      return {
        fg: mini ? getComputedStyle(mini).color : 'rgb(0,0,0)',
        bg: opaqueBg(mini)
      };
    });
    const ratio = contrast(rgbToHex(colors.fg), rgbToHex(colors.bg));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('414px: hero ≤1500px and both CTAs in first viewport', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const r = await page.evaluate(() => {
      const hero = document.querySelector('.sc-hero') as HTMLElement | null;
      const cta1 = document.querySelector('.sc-hero-btn-b') as HTMLElement | null;
      const cta2 = document.querySelector('.sc-hero-btn-o') as HTMLElement | null;
      const vh = window.innerHeight;
      return {
        heroH: hero ? Math.round(hero.getBoundingClientRect().height) : -1,
        cta1Bottom: cta1?.getBoundingClientRect().bottom ?? -1,
        cta2Bottom: cta2?.getBoundingClientRect().bottom ?? -1,
        vh
      };
    });
    expect(r.heroH).toBeLessThanOrEqual(1500);
    expect(r.cta1Bottom).toBeLessThanOrEqual(r.vh + 1);
    expect(r.cta2Bottom).toBeLessThanOrEqual(r.vh + 1);
  });

  test('900px: two-column grid, audit signals present', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const r = await page.evaluate(() => {
      const grid = document.querySelector('.sc-hero .hero-grid') as HTMLElement | null;
      const cs = grid ? getComputedStyle(grid) : null;
      const cols = cs?.gridTemplateColumns.split(' ').filter(Boolean) || [];
      const hero = document.querySelector('.sc-hero') as HTMLElement | null;
      const text = hero?.innerText || '';
      return {
        colCount: cols.length,
        maxWidth: cs?.maxWidth,
        repro: text.includes('REPRODUCIBLE'),
        seed: text.includes('0x7A3F1C9E'),
        engine: text.includes('v3.1.0')
      };
    });
    expect(r.colCount).toBe(2);
    expect(r.repro).toBe(true);
    expect(r.seed).toBe(true);
    expect(r.engine).toBe(true);
  });
});
