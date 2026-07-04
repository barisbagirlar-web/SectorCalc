#!/usr/bin/env node
/**
 * MEGA i18n AUDIT — Zero-tolerance, multi-layer quality gate
 * Layer 1-7: structural, field parity, bundle, edge cases, guard, reports
 * ISO 9001 / TÜV-certifiable methodology
 */
import { readFileSync, existsSync } from 'fs';
import { spawnSync } from 'child_process';

const RED='\x1b[31m'; const GREEN='\x1b[32m'; const YELLOW='\x1b[33m';
const BOLD='\x1b[1m'; const RESET='\x1b[0m';

const LOCALES = ['en','tr','de','fr','es','ar'];
const LOCALE_NAMES = { en:'English', tr:'Turkish', de:'German', fr:'French', es:'Spanish', ar:'Arabic' };

const COUNTS = {};

function fail(cat, msg) { COUNTS[cat] = (COUNTS[cat]||0)+1; console.log(`  ${RED}✗${RESET} ${msg}`); }
function pass(msg) { console.log(`  ${GREEN}✓${RESET} ${msg}`); }
function warn(msg) { console.log(`  ${YELLOW}⚠${RESET} ${msg}`); }

// ── Load all locale files ─────────────────────────────────────
const data = {};
console.log(`\n${BOLD}═══ LAYER 1: YAPISAL BÜTÜNLÜK ═══${RESET}\n`);
for (const loc of LOCALES) {
  try {
    const raw = readFileSync(`messages/${loc}.json`, 'utf8');
    data[loc] = JSON.parse(raw);
    pass(`${loc.toUpperCase()} (${LOCALE_NAMES[loc]}) — valid JSON, ${(raw.length/1024).toFixed(0)} KB`);
  } catch (e) {
    fail('structural', `${loc.toUpperCase()} — JSON PARSE ERROR: ${e.message}`);
    process.exit(1);
  }
}

// ── Key parity ────────────────────────────────────────────────
function collectKeys(obj, path='') {
  if (!obj || typeof obj !== 'object') return [];
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = path ? `${path}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      keys.push(...collectKeys(v, p));
    } else {
      keys.push(p);
    }
  }
  return keys;
}

const enKeys = new Set(collectKeys(data.en));
console.log(`\nEN total key: ${enKeys.size.toLocaleString()}\n`);

for (const loc of ['tr','de','fr','es','ar']) {
  const locKeys = new Set(collectKeys(data[loc]));
  const missing = [...enKeys].filter(k => !locKeys.has(k));
  const extra = [...locKeys].filter(k => !enKeys.has(k));
  if (missing.length > 0) {
    fail('structural', `${loc.toUpperCase()}: ${missing.length} EN'ye göre eksik key`);
    missing.slice(0,3).forEach(k => console.log(`       EKSIK: ${k}`));
  }
  if (extra.length > 0) {
    fail('structural', `${loc.toUpperCase()}: ${extra.length} EN'de olmayan ekstra key`);
    extra.slice(0,3).forEach(k => console.log(`       FAZLA: ${k}`));
  }
  if (missing.length === 0 && extra.length === 0) {
    pass(`${loc.toUpperCase()} — EN ile tam key uyumu`);
  }
}

// ── LAYER 2: freeToolInputs field parity ──────────────────────
console.log(`\n${BOLD}═══ LAYER 2: AREA UYUMU (freeToolInputs) ═══${RESET}\n`);

for (const loc of ['tr','de','fr','es','ar']) {
  const fti = data[loc].freeToolInputs;
  const ftiEn = data.en.freeToolInputs;
  let missing = 0; let total = 0; const seen = new Set();

  for (const [tool, fields] of Object.entries(ftiEn)) {
    for (const [field, vals] of Object.entries(fields)) {
      if (!vals || typeof vals !== 'object') continue;
      total++;
      const locField = fti[tool]?.[field];
      if (!locField || typeof locField !== 'object') {
        if (seen.size < 10) warn(`${loc}: ${tool}.${field} — TAMAMEN EKSIK`);
        seen.add(tool+'.'+field);
        missing++;
        continue;
      }
      for (const part of ['label','placeholder','helper']) {
        const enVal = vals[part];
        if (typeof enVal !== 'string' || !enVal.trim()) continue;
        if (typeof locField[part] !== 'string' || !locField[part].trim()) {
          if (seen.size < 10) warn(`${loc}: ${tool}.${field}.${part} — EKSIK`);
          seen.add(tool+'.'+field+'.'+part);
          missing++;
        }
      }
    }
  }

  if (missing === 0) {
    pass(`${loc.toUpperCase()} — ${total} areaın tümü label/placeholder/helper sahibi`);
  } else {
    fail('fieldParity', `${loc.toUpperCase()}: ${missing} alt-area eksik (${total} area içinde)`);
  }
}

// ── LAYER 3: Bundle vs Messages parity ─────────────────────────
console.log(`\n${BOLD}═══ LAYER 3: BUNDLE vs MESSAGES UYUMU ═══${RESET}\n`);

try {
  const bundle = JSON.parse(readFileSync('src/data/free-tool-inputs-i18n.generated.json', 'utf8'));
  pass('Bundle başarıyla yüklendi');

  for (const loc of LOCALES) {
    const bundleTools = bundle[loc] || {};
    const msgFti = data[loc].freeToolInputs || {};
    const bSlugs = new Set(Object.keys(bundleTools));
    const mSlugs = new Set(Object.keys(msgFti));
    const bOnly = [...bSlugs].filter(s => !mSlugs.has(s));
    const mOnly = [...mSlugs].filter(s => !bSlugs.has(s));

    if (bOnly.length > 0 || mOnly.length > 0) {
      if (bOnly.length > 0) {
        fail('bundle', `${loc.toUpperCase()}: ${bOnly.length} tool bundle'da var ama messages'da YOK`);
        bOnly.slice(0,3).forEach(s => console.log(`       BUNDLE: ${s}`));
      }
      if (mOnly.length > 0) {
        fail('bundle', `${loc.toUpperCase()}: ${mOnly.length} tool messages'da var ama bundle'da YOK`);
        mOnly.slice(0,3).forEach(s => console.log(`       MESSAGES: ${s}`));
      }
    } else {
      pass(`${loc.toUpperCase()} — ${bSlugs.size} tool, tam slug uyumu`);
    }
  }
} catch (e) {
  fail('bundle', `Bundle yükleme hatası: ${e.message}`);
}

// ── LAYER 4: Schema-field-i18n ────────────────────────────────
console.log(`\n${BOLD}═══ LAYER 4: SCHEMA-FIELD-i18n REGRESSION ═══${RESET}\n`);
try {
  const audit = spawnSync('npx', ['tsx', 'scripts/audit-schema-field-i18n.ts', '--regression'], {
    cwd: process.cwd(), stdio: 'pipe', encoding: 'utf8',
    env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' }
  });
  if (audit.status === 0) {
    pass('Schema-field-i18n regression testi GECTI');
    // Extract en-identical counts
    const idents = (audit.stdout||'').match(/(tr|de|fr|es|ar): en-identical=(\d+)/g);
    if (idents) idents.forEach(l => {
      const [loc, cnt] = l.replace('en-identical=','').split(': ');
      const num = parseInt(l.match(/(\d+)/)[1]);
      if (num > 0) warn(`${loc.toUpperCase()} — ${num} count en-identical area (bilinen) — baseline=1264`);
    });
  } else {
    fail('reports', `Schema-field-i18n regression FAILED (exit ${audit.status})`);
    console.error((audit.stderr||'').slice(-300));
  }
} catch (e) {
  fail('reports', `Schema-field-i18n hatası: ${e.message}`);
}

// ── LAYER 5: i18n GUARD ───────────────────────────────────────
console.log(`\n${BOLD}═══ LAYER 5: i18n BUILD GATE ═══${RESET}\n`);
try {
  const guard = spawnSync('node', ['scripts/i18n-guard-build.mjs'], {
    cwd: process.cwd(), stdio: 'pipe', encoding: 'utf8'
  });
  if (guard.status === 0) {
    pass('SIFIR ihlal — BUILD GECTI');
  } else {
    fail('guard', `${guard.status} ihlal — BUILD KALDI`);
    console.log((guard.stdout||'').slice(-500));
  }
} catch (e) {
  fail('guard', `Guard hatası: ${e.message}`);
}

// ── LAYER 6: SteelCore / Generate Reports ─────────────────────
console.log(`\n${BOLD}═══ LAYER 6: REPORT KALİTESİ ═══${RESET}\n`);

try {
  const report = JSON.parse(readFileSync('steelcore-validation-report.json', 'utf8'));
  const bs = report.byStatus || {};
  console.log(`  SteelCore: PASS=${bs.PASS||0} WARN=${bs.WARN||0} FAIL=${bs.FAIL||0} RUNTIME_FAIL=${bs.RUNTIME_FAIL||0} QUARANTINE=${bs.QUARANTINE||0}`);
  if (bs.PASS > 0) pass(`SteelCore: ${report.valid}/${report.total} gecerli`);
  if ((bs.QUARANTINE||0) > 0) fail('reports', `${bs.QUARANTINE} schema QUARANTINE — historical session bilinen borc`);
  if ((bs.FAIL||0) > 0) fail('reports', `${bs.FAIL} schema FAIL — emergency intervention gerekli`);
} catch (e) {
  fail('reports', `SteelCore report hatasi: ${e.message}`);
}

try {
  const gen = JSON.parse(readFileSync('generated/generate-report.json', 'utf8'));
  const s = gen.summary || {};
  console.log(`  Generate: total=${s.total} success=${s.success} failed=${s.failed} stubRepair=${s.stubRepaired}`);
  const aa = gen.archetypeAudit || {};
  if (aa.needsReview > 0) fail('reports', `${aa.needsReview} schema archetype incelemesi gerektiriyor`);
  if (!aa.needsReview || aa.needsReview === 0) pass('Archetype distribution OK');
} catch (e) {
  fail('reports', `Generate report hatasi: ${e.message}`);
}

// ── LAYER 7: Edge cases ───────────────────────────────────────
console.log(`\n${BOLD}═══ LAYER 7: KENAR DURUMLAR ═══${RESET}\n`);

let edgeIssues = 0;
for (const loc of LOCALES) {
  const fti = data[loc].freeToolInputs || {};
  for (const [tool, fields] of Object.entries(fti)) {
    for (const [field, vals] of Object.entries(fields)) {
      if (!vals || typeof vals !== 'object') continue;
      for (const part of ['label','placeholder','helper']) {
        const v = vals[part];
        if (v === null || v === undefined) {
          if (edgeIssues < 5) fail('edgeCase', `${loc}.${tool}.${field}.${part} — null/undefined`);
          edgeIssues++;
        } else if (typeof v === 'string' && v.trim().length === 0) {
          if (edgeIssues < 5) fail('edgeCase', `${loc}.${tool}.${field}.${part} — BOS string`);
          edgeIssues++;
        } else if (typeof v !== 'string') {
          if (edgeIssues < 5) fail('edgeCase', `${loc}.${tool}.${field}.${part} — tip=${typeof v}`);
          edgeIssues++;
        }
      }
    }
  }
}
if (edgeIssues === 0) {
  pass('Tum alanlar: null, empty, tip hatasi YOK');
} else {
  fail('edgeCase', `${edgeIssues} kenar status sorunu (ilk 5 gosterildi)`);
}

// ── FINAL SUMMARY ─────────────────────────────────────────────
const CAT_LABELS = {
  structural: 'Yapisal Butunluk',
  fieldParity: 'Area Uyumu',
  bundle: 'Bundle Uyumu',
  edgeCase: 'Kenar Durumlar',
  guard: 'i18n Guard',
  reports: 'Report Kalitesi'
};

const total = Object.values(COUNTS).reduce((a,b) => a+b, 0);
console.log(`\n${BOLD}${'═'.repeat(55)}${RESET}`);
console.log(`${BOLD}  MEGA AUDIT — KESIN QUALITY Report${RESET}`);
console.log(`${BOLD}${'═'.repeat(55)}${RESET}`);
console.log(`  ${'Kategori'.padEnd(25)} ${'Result'.padEnd(10)} Count`);
console.log(`  ${'─'.repeat(50)}`);
for (const [cat, count] of Object.entries(COUNTS).sort((a,b) => b[1]-a[1])) {
  const label = CAT_LABELS[cat] || cat;
  const status = count === 0 ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
  console.log(`  ${label.padEnd(25)} ${status.padEnd(10)} ${count}`);
}
console.log(`  ${'─'.repeat(50)}`);
const allCats = ['structural','fieldParity','bundle','edgeCase','guard','reports'];
for (const cat of allCats) {
  if (!(cat in COUNTS)) {
    const label = CAT_LABELS[cat] || cat;
    console.log(`  ${label.padEnd(25)} ${GREEN}PASS${RESET.padEnd(10)} 0`);
  }
}
console.log(`  ${'─'.repeat(50)}`);
const verdict = total === 0 ? `${GREEN}TEMIZ — SIFIR BORC${RESET}` : `${RED}${total} SORUN TESPIT EDILDI${RESET}`;
console.log(`  ${'TOTAL'.padEnd(25)} ${verdict}`);
console.log(`${BOLD}${'═'.repeat(55)}${RESET}\n`);

process.exit(total > 0 ? 1 : 0);
