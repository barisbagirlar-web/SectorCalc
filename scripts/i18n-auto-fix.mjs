#!/usr/bin/env node
/**
 * i18n AUTO-FIX — DeepSeek batch translation for detected EN leaks
 *
 * Detects all real English leaks across all locales and translates them
 * using DeepSeek API in one shot per locale.
 *
 * Usage:
 *   node scripts/i18n-auto-fix.mjs           # fix all locales
 *   node scripts/i18n-auto-fix.mjs --check   # dry-run: show what would be fixed
 *
 * Perfect for: CI pipeline, pre-commit hook, manual fix before build
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

// ── Load API key ───────────────────────────────────────────
const envPath = '.env.local';
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (t && !t.startsWith('#')) {
      const eq = t.indexOf('=');
      if (eq > 0) process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
    }
  }
}

const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/chat/completions';

const LOCALE_NAMES = { tr: 'Turkish', de: 'German', fr: 'French', es: 'Spanish', ar: 'Arabic' };

// ── Skip rules (same as i18n-guard-build.mjs) ──────────────
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
  'MarginCore · Phase 2', 'CNC', 'OEE', 'kWh', 'Shop Rate',
  'Scope 1', 'Scope 2', 'Scope 3',
  'Acceptable', 'Reproducible', 'Parameter', 'Validation',
  'Incorrect', 'Correct', 'Guide', '[HTML]', 'PDF', 'CSV',
  'Delay', 'Disruption',
]);

function getValue(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) { if (!cur || typeof cur !== 'object') return undefined; cur = cur[p]; }
  return cur;
}
function setValue(obj, path, value) {
  const parts = path.split('.');
  const last = parts.pop();
  if (!last) return;
  let cur = obj;
  for (const p of parts) { if (!cur[p] || typeof cur[p] !== 'object') cur[p] = {}; cur = cur[p]; }
  cur[last] = value;
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
  if (text.startsWith('/') || text.startsWith('{')) return true;
  // Language-suffixed keys (*Tr, *De, *Fr, *Es, *Ar) — non-English by design
  if (/(Tr|De|Fr|Es|Ar)$/.test(path.split('.').pop())) return true;
  if (path.endsWith('.id') || path.endsWith('.titleKey') || path.endsWith('.bodyKey')) return true;
  if (path.includes('.bulletKeys.') || path.includes('.items.') || path.includes('.href') || path.includes('.tags.')) return true;
  // Known intentional English paths
  if (path.includes('verify.') || path.includes('.metaTraceId') || path.includes('.labelHash') || path.includes('.notFoundHash')) return true;
  if (path.includes('industries.metaTitle') && text.startsWith('Industries')) return true;
  if (/^[a-z_0-9{}[\]]+$/.test(text) || /^[\d.,\s\-—/:()]+$/.test(text)) return true;
  if (/^MR\s\{\w+\}$/.test(text) || /^SC-/.test(text)) return true;
  if (/^[\w./]+$/.test(text) && text.length < 8 && !text.includes(' ')) return true;
  return false;
}

async function translateBatch(texts, locale) {
  const name = LOCALE_NAMES[locale] || locale;
  const input = texts.map((t, i) => `[${i}] ${t.enText}`).join('\n');

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.05,
      max_tokens: 8192,
      messages: [
        {
          role: 'system',
          content: `Professional translator for industrial engineering software. Translate EACH numbered line to ${name} (${locale}). CRITICAL: translate EVERY line — even single words like "Material", "Description", "Transport". Output format: [N] translated_text. Preserve {placeholders}, brand names (SectorCalc, Trace, Pro, Trust Trace, Six Sigma, Lean, ISO, ASME).`
        },
        { role: 'user', content: input }
      ]
    })
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';

  const results = {};
  for (const line of content.split('\n')) {
    const m = line.match(/^\[(\d+)\]\s*(.+)/);
    if (m) {
      const idx = parseInt(m[1]);
      if (idx < texts.length) results[texts[idx].path] = m[2].trim();
    }
  }
  return results;
}

async function main() {
  const isDryRun = process.argv.includes('--check');

  if (!API_KEY) {
    console.error(`${RED}ERROR: DEEPSEEK_API_KEY not found in .env.local${RESET}`);
    console.error(`${YELLOW}Fix: DEEPSEEK_API_KEY=sk-... node scripts/i18n-auto-fix.mjs${RESET}`);
    process.exit(1);
  }

  if (isDryRun) {
    console.log(`${BOLD}${YELLOW}═══ i18n CHECK — dry run ═══${RESET}\n`);
  } else {
    console.log(`${BOLD}${YELLOW}═══ i18n AUTO-FIX ═══${RESET}\n`);
  }

  const en = JSON.parse(readFileSync('messages/en.json', 'utf8'));
  const allPaths = collectPaths(en);
  const locales = ['tr', 'de', 'fr', 'es', 'ar'];

  let totalLeaks = 0;

  for (const locale of locales) {
    const data = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'));
    const todo = [];

    for (const { path, enText } of allPaths) {
      if (isSkippable(enText, path)) continue;
      if (getValue(data, path) === enText) {
        todo.push({ path, enText });
      }
    }

    if (todo.length === 0) {
      console.log(`  ${GREEN}✓ ${locale.toUpperCase()}${RESET} — CLEAN`);
      continue;
    }

    console.log(`  ${YELLOW}→ ${locale.toUpperCase()}${RESET} (${todo.length} leak(s))`);

    if (isDryRun) {
      const bySection = {};
      for (const t of todo) {
        const s = t.path.split('.')[0];
        if (!bySection[s]) bySection[s] = [];
        bySection[s].push(t);
      }
      for (const [section, items] of Object.entries(bySection).sort((a, b) => b[1].length - a[1].length)) {
        console.log(`      [${section}] ${items.length}`);
        items.slice(0, 2).forEach(item => console.log(`        ${item.path}: "${item.enText.substring(0, 60)}"`));
        if (items.length > 2) console.log(`        ...`);
      }
      totalLeaks += todo.length;
      continue;
    }

    // Translate in batches of 150
    const BATCH = 150;
    let ok = 0;

    for (let i = 0; i < todo.length; i += BATCH) {
      const batch = todo.slice(i, i + BATCH);
      process.stdout.write(`    ${Math.round(100 * i / todo.length)}%...\r`);

      try {
        const translations = await translateBatch(batch, locale);
        for (const { path } of batch) {
          const t = translations[path];
          if (t && t !== getValue(data, path)) { setValue(data, path, t); ok++; }
        }
      } catch (e) {
        console.error(`\n    ${RED}ERROR: ${e.message}${RESET}`);
      }
      await new Promise(r => setTimeout(r, 200));
    }

    writeFileSync(`messages/${locale}.json`, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`    Done: ${ok}/${todo.length} translated`);

    totalLeaks += todo.length - ok;
  }

  console.log(`\n${BOLD}═══ RESULT ═══${RESET}`);
  if (totalLeaks === 0) {
    console.log(`${GREEN}✓ All locales CLEAN${RESET}`);
  } else if (isDryRun) {
    console.log(`${YELLOW}→ ${totalLeaks} leak(s) detected — run without --check to fix${RESET}`);
    process.exit(totalLeaks > 0 ? 1 : 0);
  } else {
    console.log(`${RED}✗ ${totalLeaks} leak(s) remaining (API rejected these items)${RESET}`);
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
