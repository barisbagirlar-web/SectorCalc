/**
 * Adversarial edge-case matrix against live SectorCalc.
 *
 * LEVEL 3-5: for every tool, inject hostile values (0, negative, NaN, Infinity,
 * huge, tiny, string, emoji, XSS) into the first visible numeric inputs and
 * capture: console errors, page errors, 4xx/5xx responses, whether the result/
 * report surface still renders something sane, and whether the page crashes.
 */
import { chromium } from 'playwright';

const BASE = 'https://sectorcalc.com';
// All 25 live tools from TOOL_META SSOT.
const TOOLS = [
  ['SC-001', '/calculator/weld-thickness', 'free'],
  ['SC-008', '/calculator/tolerance-stack-up', 'paid'],
  ['SC-010', '/calculator/true-labor-cost', 'paid'],
  ['SC-012', '/calculator/quote-pricing', 'paid'],
  ['SC-020', '/calculator/cnc-feeds-speeds', 'paid'],
  ['SC-021', '/calculator/bearing-life-l10', 'paid'],
  ['SC-022', '/calculator/tap-thread-milling', 'paid'],
  ['SC-023', '/calculator/cycle-time-cost', 'paid'],
  ['SC-024', '/calculator/bearing-frequencies', 'paid'],
  ['SC-025', '/calculator/belt-chain-drive', 'paid'],
  ['SC-026', '/calculator/shaft-design', 'paid'],
  ['SC-027', '/calculator/iso-286-fits', 'free'],
  ['SC-028', '/calculator/surface-finish', 'free'],
  ['SC-029', '/calculator/weld-heat-input', 'paid'],
  ['SC-030', '/calculator/sheet-metal-bend', 'free'],
  ['SC-031', '/calculator/sling-capacity', 'paid'],
  ['SC-032', '/calculator/shackle-eyebolt', 'paid'],
  ['SC-033', '/calculator/pressure-vessel-shell', 'paid'],
  ['SC-034', '/calculator/pipe-wall-thickness', 'paid'],
  ['SC-035', '/calculator/bolt-torque-preload', 'paid'],
  ['SC-036', '/calculator/bolted-joint', 'paid'],
  ['SC-037', '/calculator/oee-teep', 'paid'],
  ['SC-038', '/calculator/machine-hour-rate', 'paid'],
  ['SC-039', '/calculator/punching-force', 'free'],
  ['SC-040', '/calculator/hydraulic-cylinder', 'paid']
];

const HOSTILE = [
  { label: 'zero', value: '0' },
  { label: 'negative', value: '-999' },
  { label: 'nan', value: 'NaN' },
  { label: 'inf', value: '1e308' },
  { label: 'huge', value: '999999999999' },
  { label: 'tiny', value: '0.000001' },
  { label: 'string', value: 'abc' },
  { label: 'emoji', value: '🔧😀' },
  { label: 'script', value: '<img src=x onerror=alert(1)>' }
];

const browser = await chromium.launch({ headless: true });

// Per-tool wall-clock guard: a hostile input must never hang the whole matrix.
// SC-008's 10k-run Decimal Monte Carlo used to block the main thread for ~84s,
// which defeats Playwright's normal timeouts (they only fire when the page
// yields). With the deterministic-simulation LRU cache + input debounce, each
// fresh input recomputes ~4.4s (1 main + 3 what-if simulations) instead of
// hanging; the guard is the belt-and-suspenders safety net and must cover the
// 8 hostile values × ~5s worst case (~44s).
const TOOL_HARD_TIMEOUT_MS = 90_000;

async function withToolTimeout(page, fn, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`TOOL TIMEOUT (${TOOL_HARD_TIMEOUT_MS}ms) at ${label}`)), TOOL_HARD_TIMEOUT_MS);
  });
  try {
    return await Promise.race([fn(), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

const report = [];
for (const [code, url, kind] of TOOLS) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.setDefaultTimeout(12000);
  const entry = { code, url, kind, consoleErrors: [], pageErrors: [], badResponses: [], hostile: [], toolTimeout: false };
  page.removeAllListeners('console');
  page.removeAllListeners('pageerror');
  page.removeAllListeners('response');
  page.on('console', (m) => {
    if (m.type() === 'error') entry.consoleErrors.push(m.text().slice(0, 160));
  });
  page.on('pageerror', (e) => entry.pageErrors.push(String(e).slice(0, 200)));
  page.on('response', (r) => {
    const st = r.status();
    if (st >= 400 && st < 600) entry.badResponses.push(`${r.status()} ${r.url().slice(0, 120)}`);
  });

  try {
    await withToolTimeout(page, async () => {
      let loadOk = true;
      try {
        const resp = await page.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        if (!resp || resp.status() >= 400) loadOk = false;
        await page.waitForTimeout(3000);
      } catch (e) {
        entry.pageErrors.push('LOAD: ' + String(e).slice(0, 120));
        loadOk = false;
      }

      if (loadOk) {
        // Baseline result text before any hostile input.
        const baseline = await page.evaluate(() => {
          const pick = () => {
            for (const sel of ['#reportArea', '#verdict', '#liveResult', '.sc-card-res', '.result']) {
              const el = document.querySelector(sel);
              if (el && (el.textContent || '').trim()) return el.textContent.trim().slice(0, 80);
            }
            return null;
          };
          return {
            text: pick(),
            empty: !!document.querySelector('.sc-empty'),
            // Some legacy pages carry literal "NaN"/"Infinity" strings in static
            // text or CSS comments. A hostile leak is ONLY a leak if the pristine
            // page did NOT already contain the token.
            bodyNaN: document.body.textContent.includes('NaN'),
            bodyInf: document.body.textContent.includes('Infinity')
          };
        });
        entry.baseline = baseline.text;
        entry.baselineEmpty = baseline.empty;
        entry.baselineNaN = baseline.bodyNaN;
        entry.baselineInf = baseline.bodyInf;

        // Get visible numeric inputs (max 4).
        const inputs = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('input'))
            .filter((el) => {
              const t = el.getAttribute('type');
              if (t && ['hidden', 'submit', 'button', 'checkbox', 'radio'].includes(t)) return false;
              const cs = getComputedStyle(el);
              return cs.display !== 'none' && cs.visibility !== 'hidden' && el.getBoundingClientRect().height > 0;
            })
            .slice(0, 4)
            .map((el) => el.id || el.name || el.className);
        });

        // Baseline console errors specifically for the pristine page.
        const pristineErrors = entry.consoleErrors.slice();

        for (let i = 0; i < inputs.length; i++) {
          const input = inputs[i];
          // Use the nastiest 4 values on this input.
          const vals = HOSTILE.slice(i * 2, i * 2 + 2);
          for (const v of vals) {
            const before = entry.consoleErrors.length;
            let ok = true;
            let result = null;
            try {
              const injected = await page.evaluate(
                ([sel, val]) => {
                  const el = document.getElementById(sel) || document.querySelector(`input[name="${sel}"]`);
                  if (!el) return { found: false };
                  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                  setter.call(el, val);
                  el.dispatchEvent(new Event('input', { bubbles: true }));
                  el.dispatchEvent(new Event('change', { bubbles: true }));
                  return { found: true };
                },
                [input, v.value]
              );
              await page.waitForTimeout(800);
              if (injected.found) {
                result = await page.evaluate(() => {
                  const pick = () => {
                    for (const sel of ['#reportArea', '#verdict', '#liveResult', '.sc-card-res', '.result']) {
                      const el = document.querySelector(sel);
                      if (el && (el.textContent || '').trim()) return el.textContent.trim().slice(0, 80);
                    }
                    return null;
                  };
                  return { text: pick(), bodyNaN: document.body.textContent.includes('NaN'), bodyInf: document.body.textContent.includes('Infinity') };
                });
              }
            } catch (e) {
              ok = false;
            }
            const newErrors = entry.consoleErrors.slice(before);
            const newPages = entry.pageErrors.length;
            // A token already present on the pristine page (static text/CSS) is an
            // artifact, not a hostile leak: report it as artifact, keep leak=false.
            const nanLeak = result ? result.bodyNaN && !entry.baselineNaN : false;
            const infLeak = result ? result.bodyInf && !entry.baselineInf : false;
            const nanArtifact = result ? result.bodyNaN && entry.baselineNaN : false;
            entry.hostile.push({
              input,
              val: v.label,
              ok,
              result: result ? result.text : null,
              nanOnPage: nanLeak,
              infOnPage: infLeak,
              nanArtifact,
              newConsoleErrors: newErrors,
              pageError: newPages > 0
            });
          }
          // Restore a sane value so the next input starts clean.
          await page.evaluate(
            ([sel]) => {
              const el = document.getElementById(sel);
              if (el) {
                const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                setter.call(el, '10');
                el.dispatchEvent(new Event('input', { bubbles: true }));
              }
            },
            [input]
          );
          await page.waitForTimeout(400);
        }
        entry.pristineErrors = pristineErrors;
      }
    }, `${code} ${url}`);
  } catch (e) {
    entry.toolTimeout = true;
    entry.pageErrors.push(String(e).slice(0, 160));
    console.log(`TIMEOUT ${code} ${url} — page closed, continuing`);
  } finally {
    await page.close();
  }

  report.push(entry);
  const issues = entry.pageErrors.length + entry.badResponses.length;
  const nanInf = entry.hostile.filter((h) => h.nanOnPage || h.infOnPage).length;
  const crashes = entry.hostile.filter((h) => !h.ok).length;
  const okLoad = !entry.toolTimeout && !entry.pageErrors.some((e) => e.startsWith('LOAD'));
  console.log(
    `${okLoad ? 'OK' : 'LOADFAIL'} ${code.padEnd(6)} ${url.padEnd(38)} baseline=${entry.baseline ? 'Y' : 'N'} pristineErr=${entry.pristineErrors?.length || 0} pageErr=${entry.pageErrors.length} badHttp=${entry.badResponses.length} nanInf=${nanInf}/${entry.hostile.length} crashes=${crashes}${entry.toolTimeout ? ' TIMEOUT' : ''}`
  );
}

await browser.close();

// Summary
console.log('\n================= SUMMARY =================');
const withPageErrors = report.filter((r) => r.pageErrors.length > 0);
const withBadHttp = report.filter((r) => r.badResponses.length > 0);
const withPristineErr = report.filter((r) => (r.pristineErrors || []).length > 0);
const withNanInf = report.filter((r) => r.hostile.some((h) => h.nanOnPage || h.infOnPage));
const withCrashes = report.filter((r) => r.hostile.some((h) => !h.ok));
const withTimeouts = report.filter((r) => r.toolTimeout);
const withEmptyBaseline = report.filter((r) => !r.baseline);
console.log(`Total: ${report.length} tools`);
console.log(`Tool hard timeouts (main thread hung): ${withTimeouts.length}`);
for (const t of withTimeouts) console.log(`  TIMEOUT: ${t.code} ${t.url}`);
console.log(`Empty baseline result: ${withEmptyBaseline.length}`);
for (const t of withEmptyBaseline) console.log(`  EMPTY: ${t.code} ${t.url}`);
console.log(`Pristine console errors: ${withPristineErr.length}`);
for (const t of withPristineErr) console.log(`  PRISTINE-ERR: ${t.code} ${t.url} :: ${t.pristineErrors.join(' | ').slice(0, 200)}`);
console.log(`Page errors: ${withPageErrors.length}`);
for (const t of withPageErrors) console.log(`  PAGE-ERR: ${t.code} ${t.url} :: ${t.pageErrors.join(' | ').slice(0, 200)}`);
console.log(`Bad HTTP responses: ${withBadHttp.length}`);
for (const t of withBadHttp) console.log(`  HTTP: ${t.code} ${t.url} :: ${t.badResponses.join(' | ').slice(0, 200)}`);
console.log(`NaN/Infinity leak after hostile input: ${withNanInf.length}`);
for (const t of withNanInf) {
  const hits = t.hostile.filter((h) => h.nanOnPage || h.infOnPage).map((h) => `${h.input}=${h.val}`);
  console.log(`  NANINF: ${t.code} ${t.url} :: ${hits.join(', ')}`);
}
const withArtifacts = report.filter((r) => r.hostile.some((h) => h.nanArtifact));
console.log(`Pristine NaN/Infinity artifacts (static text/CSS, not leaks): ${withArtifacts.length}`);
for (const t of withArtifacts) {
  const hits = t.hostile.filter((h) => h.nanArtifact).map((h) => `${h.input}=${h.val}`);
  console.log(`  ARTIFACT: ${t.code} ${t.url} :: ${hits.join(', ')}`);
}
console.log(`Crash/exception during injection: ${withCrashes.length}`);
for (const t of withCrashes) console.log(`  CRASH: ${t.code} ${t.url}`);
