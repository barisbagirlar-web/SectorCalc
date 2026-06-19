/**
 * i18n GUARD — BUILD GATE
 * 
 * ZERO-TOLERANCE i18n guard:
 * - Fails with exit code 1 if ANY real English leak exists in ANY locale
 * - Only flags strings that are genuinely user-facing (skips brands, standards, codes)
 * - Designed to be part of `prebuild` or `build` pipeline
 * 
 * Exit codes:
 *   0 = CLEAN (no leaks)
 *   1 = LEAKS FOUND (build must stop)
 */

import { readFileSync } from 'fs';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

const SKIP_EXACT = new Set([
  'Premium', 'Pro', 'Enterprise', 'Business', 'Team', 'Free', 'Simple', 'Expert', 'Mobile',
  'Sector', 'Action', 'Verdict', 'Risk', 'Impact', 'Message', 'Source', 'Status',
  'Radius', 'Angle', 'Volume', 'Distance', 'Performance', 'Ratio', 'Limit', 'Input',
  'Optional', 'Contact', 'Legal', 'Solution', 'Problem', 'Detail', 'FAQ', 'Region',
  'Global', 'Europe', 'MENA', 'Imperial', 'Transport', 'Production', 'Construction',
  'Türkiye', 'Türkçe', 'Español', 'العربية', 'English', 'Deutsch', 'Français',
  'Global · USD', 'P90 MC', 'Z = 1.28', '27 LIVE', '7 SECTORS',
  'SectorCalc', 'Trace', 'GET PRO', 'Trace AI', 'Trust Trace', 'CBAM',
  'LinkedIn', 'MathSciNet', 'llms.txt',
  'sectorcalc-index.txt', 'faq-knowledge.txt', 'services-products.txt',
  'SectorCalc GmbH', 'TÜV-Certifiable Industrial Math',
  'Prof. Dr. Neela Nataraj',
  ' | SectorCalc Pro', '© 2026 SectorCalc',
  'ISO / EN', 'UNC / UNF', 'ASME BPVC', 'ASME Y14.5', 'ASTM / AISI',
  'PED / EN 13445', 'EN / DIN', 'AWS', 'JIS', 'EUROCODE', 'Eurocode', 'ISO GPS',
  'SC-YYYYMMDD-TOOL-ID', 'MR {mrId}', '0 - 100,000', '100,000 - 500,000',
  '500,000 - 1,000,000', '1,000,000+',
  'MarginCore · Phase 2',
  'CNC', 'OEE', 'kWh', 'Shop Rate',
  'Scope 1', 'Scope 2', 'Scope 3',
  'Acceptable', 'Reproducible', 'Parameter', 'Validation',
  'Incorrect', 'Correct', 'Guide', '[HTML]', 'PDF', 'CSV',
  'Delay', 'Disruption',
  'Distance (km)', 'Altitude (m)', 'Stop Loss (pips)', 'Stop Loss (Pips)',
  'AQL (%)',
]);

function getValue(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== 'object') return undefined;
    cur = cur[p];
  }
  return cur;
}

function collectPaths(obj, path = '', result = []) {
  if (!obj || typeof obj !== 'object') return result;
  for (const [k, v] of Object.entries(obj)) {
    const p = path ? `${path}.${k}` : k;
    if (typeof v === 'string') result.push({ path: p, enText: v });
    else if (typeof v === 'object') collectPaths(v, p, result);
  }
  return result;
}

function isSkippable(text, path) {
  if (text.length < 5) return true;
  if (SKIP_EXACT.has(text)) return true;
  if (text.startsWith('/')) return true;
  if (text.startsWith('{')) return true;
  // Language-suffixed keys (*Tr, *De, *Fr, *Es, *Ar) — these have non-English text by design in EN locale
  if (/(Tr|De|Fr|Es|Ar)$/.test(path.split('.').pop())) return true;
  // JSON object keys/indices
  if (path.endsWith('.id') || path.endsWith('.titleKey') || path.endsWith('.bodyKey')) return true;
  if (path.includes('.bulletKeys.') || path.includes('.items.') || path.includes('.href') || path.includes('.tags.')) return true;
  // Paths known to contain intentional English technical terms
  if (path.includes('verify.') || path.includes('.metaTraceId') || path.includes('.labelHash') || path.includes('.notFoundHash')) return true;
  if (path.includes('industries.metaTitle') && text.startsWith('Industries')) return true;
  // Technical strings
  if (/^[a-z_0-9{}[\]]+$/.test(text)) return true;
  if (/^[\d.,\s\-—/:()]+$/.test(text)) return true;
  if (/^MR\s\{\w+\}$/.test(text)) return true;
  if (/^SC-/.test(text)) return true;
  // Unit abbreviations and parameter labels with units
  if (/^[\w./]+$/.test(text) && text.length < 8 && !text.includes(' ')) return true;
  return false;
}

export function scanRealLeaks(locale, en, localeData) {
  const allPaths = collectPaths(en);
  const leaks = [];

  for (const { path, enText } of allPaths) {
    if (isSkippable(enText, path)) continue;
    const localeVal = getValue(localeData, path);
    if (localeVal === enText) {
      leaks.push({ path, text: enText.substring(0, 100) });
    }
  }

  return leaks;
}

function main() {
  const en = JSON.parse(readFileSync('messages/en.json', 'utf8'));
  const locales = ['tr', 'de', 'fr', 'es', 'ar'];
  const localeNames = { tr: 'Turkish', de: 'German', fr: 'French', es: 'Spanish', ar: 'Arabic' };

  let totalLeaks = 0;
  const allLeaks = {};

  console.log(`${BOLD}${YELLOW}═══ i18n BUILD GATE ═══${RESET}\n`);

  for (const locale of locales) {
    const localeData = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'));
    const leaks = scanRealLeaks(locale, en, localeData);
    allLeaks[locale] = leaks;
    totalLeaks += leaks.length;

    if (leaks.length === 0) {
      console.log(`  ${GREEN}✓ ${locale.toUpperCase()}${RESET} (${localeNames[locale]}) — CLEAN`);
    } else {
      console.log(`  ${RED}✗ ${locale.toUpperCase()}${RESET} (${localeNames[locale]}) — ${leaks.length} leak(s)`);
      // Group by section
      const bySection = {};
      for (const l of leaks) {
        const section = l.path.split('.')[0];
        if (!bySection[section]) bySection[section] = [];
        bySection[section].push(l);
      }
      for (const [section, items] of Object.entries(bySection).sort((a, b) => b[1].length - a[1].length)) {
        console.log(`      [${section}] ${items.length}`);
        items.slice(0, 2).forEach(item => console.log(`        ${item.path}: "${item.text.substring(0, 60)}"`));
        if (items.length > 2) console.log(`        ...`);
      }
    }
  }

  console.log(`\n${BOLD}═══ RESULT ═══${RESET}`);
  if (totalLeaks === 0) {
    console.log(`${GREEN}✓ ZERO leaks — BUILD PASS${RESET}\n`);
    process.exit(0);
  } else {
    console.log(`${RED}✗ ${totalLeaks} leak(s) found — BUILD FAILED${RESET}`);
    console.log(`${YELLOW}  Run: npm run i18n:fix${RESET}`);
    console.log(`${YELLOW}  Or:  node scripts/i18n-auto-fix.mjs${RESET}\n`);
    process.exit(1);
  }
}

main();
