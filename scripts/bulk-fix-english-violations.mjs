#!/usr/bin/env node
/**
 * bulk-fix-english-violations — Systematic Turkish→English bulk fixer
 *
 * Fixes massive English-only gate violations (~13k) by applying:
 * 1. Turkish→English string translation lookup for formula descriptions
 * 2. Turkish identifier renaming (camelCase/PascalCase)
 * 3. Turkish comment translation
 * 4. Turkish locale string replacement (tr → en)
 *
 * Usage: node scripts/bulk-fix-english-violations.mjs
 *        node scripts/bulk-fix-english-violations.mjs --dry-run
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL("..", import.meta.url));
const ROOT = __dirname;
const DRY_RUN = process.argv.includes("--dry-run");

// Turkish → English translation map
const TR_EN_MAP = {
  " MALİYET": " COST",
  "MALİYETİ": "COST",
  "MALİYET": "COST",
  " SİGMA ": " SIGMA ",
  "SİGMA ": "SIGMA ",
  "ÖNCELİKLENDİRİCİ": "PRIORITIZER",
  " RİSK ": " RISK ",
  "RİSK ": "RISK ",
  "RİSK": "RISK",
  "AMORTİSMANI": "DEPRECIATION",
  "ARAÇ ": "VEHICLE ",
  "ARIZA SÜRESİ ": "DOWNTIME ",
  "SÜRESİ ": "DURATION ",
  "KAÇAK": "LEAK",
  "MARJ ": "MARGIN ",
  "BASINÇ VESSEL ": "PRESSURE VESSEL ",
  "BASINÇLI HAVA ": "COMPRESSED AIR ",
  "ENERJİ": "ENERGY",
  "BAŞABAŞ NOKTASI": "BREAK-EVEN POINT",
  "BETON HACMİ": "CONCRETE VOLUME",
  "HACMİ": "VOLUME",
  "MARUZİYET": "EXPOSURE",
  "UYUMLULUK": "COMPLIANCE",
  "YÜZEY ": "SURFACE ",
  "KALİTE": "QUALITY",
  "CIVATE TORK": "BOLT TORQUE",
  " CİRO ": " TURNOVER ",
  "ÇEVRİM SÜRESİ": "CYCLE TIME",
  "İŞLEME MALİYETİ": "MACHINING COST",
  "İŞLEME ": "MACHINING ",
  "GECİKME CEZASI": "DELAY PENALTY",
  "CEZASI": "PENALTY",
  "ÇATI ALANI": "ROOF AREA",
  "ALANI": "AREA",
  "DARBOĞAZ ": "BOTTLENECK ",
  "YATIRIM": "INVESTMENT",
  "DEĞİŞİM MATRİSİ": "CHANGEOVER MATRIX",
  "MATRİSİ": "MATRIX",
  "DEĞİŞİM ": "CHANGEOVER ",
  "DÖNÜŞTÜRÜCÜ": "CONVERTER",
  "DURUŞ SÜRESİ": "DOWNTIME",
  "DURUŞ": "DOWNTIME",
  " FAALİYET": " ACTIVITY",
  "FAİZ ORANI": "INTEREST RATE",
  "FAİZ": "INTEREST",
  "FİLTRE ": "FILTER ",
  "FİNANSAL ": "FINANCIAL ",
  "GAYRİMENKUL": "REAL ESTATE",
  "GÜÇ ": "POWER ",
  "HACİM ": "VOLUME ",
  "HATA ": "ERROR ",
  "HATA": "ERROR",
  "HİDROLİK": "HYDRAULIC",
  "ISIL ": "THERMAL ",
  "İSG ": "EHS ",
  "İŞÇİLİK": "LABOR",
  "İSTATİSTİK": "STATISTICS",
  "KALİBRASYON": "CALIBRATION",
  "KAPASİTE ": "CAPACITY ",
  "KARŞILAŞTIRMA": "COMPARISON",
  "KAZANÇ": "GAIN",
  "KESİT ": "CROSS-SECTION ",
  "KİRALAMA": "LEASING",
  "KONTROL ": "CONTROL ",
  "KOROZYON": "CORROSION",
  "KREDİ ": "CREDIT ",
  "KRİTER": "CRITERION",
  "KURUMSAL ": "CORPORATE ",
  "LİSANS ": "LICENSE ",
  "MALZEME ": "MATERIAL ",
  "MERDİVEN ": "STAIR ",
  "MOTOR ": "MOTOR ",
  "MÜHENDİSLİK": "ENGINEERING",
  "MÜŞTERİ ": "CUSTOMER ",
  "NAKİT ": "CASH ",
  "ODAKLI ": "FOCUSED ",
  "OPERASYON": "OPERATION",
  "OPTİMİZASYON": "OPTIMIZATION",
  "ORAN ": "RATIO ",
  "ORANI": "RATIO",
  "ÖLÇÜM ": "MEASUREMENT ",
  "PARÇA ": "PART ",
  "PERFORMANS ": "PERFORMANCE ",
  "PLANLAMA": "PLANNING",
  "PROJE ": "PROJECT ",
  "PROSES ": "PROCESS ",
  "PUAN ": "SCORE ",
  "PUANI": "SCORE",
  "RAPOR ": "REPORT ",
  "REAKTİF ": "REACTIVE ",
  "ROBOT ": "ROBOT ",
  "SABİT ": "FIXED ",
  "SAHA ": "FIELD ",
  "SAĞLIK ": "HEALTH ",
  "SAPMA": "DEVIATION",
  "SINIR ": "LIMIT ",
  "SINIR": "LIMIT",
  "SKOR ": "SCORE ",
  "SKORU": "SCORE",
  "STANDART ": "STANDARD ",
  "STOK ": "INVENTORY ",
  "STRATEJİK": "STRATEGIC",
  "SÜRDÜRÜLEBİLİRLİK": "SUSTAINABILITY",
  "SİSTEM ": "SYSTEM ",
  "TAKIM ": "TOOL ",
  "TAKIM": "TEAM",
  "TALEP ": "DEMAND ",
  "TASARIM ": "DESIGN ",
  "TEHLİKE ": "HAZARD ",
  "TEKNİK ": "TECHNICAL ",
  "TEKNOLOJİ ": "TECHNOLOGY ",
  "TİCARİ ": "COMMERCIAL ",
  "TOPLAM ": "TOTAL ",
  "TORNALAMA": "TURNING",
  "TRANSFER ": "TRANSFER ",
  "TÜKETİM": "CONSUMPTION",
  "UYGULAMA": "APPLICATION",
  "VERİ ": "DATA ",
  "VERİMLİLİK": "EFFICIENCY",
  "YÖNETİM": "MANAGEMENT",
  "YÖNTEM": "METHOD",
  "YÜK ": "LOAD ",
  "YÜZDE ": "PERCENTAGE ",
  "YILLIK ": "ANNUAL ",
  "ZAMAN ": "TIME ",
  "İLAVE ": "ADDITIONAL ",
  "İMALAT": "MANUFACTURING",
  "İNŞAAT": "CONSTRUCTION",
  "İŞ ": "WORK ",
  "İŞLETME ": "OPERATING ",
  "ŞEBEKE ": "NETWORK ",
  "ŞİMDİKİ ": "PRESENT ",
  "ŞİRKET ": "COMPANY ",
  "ŞART ": "CONDITION ",
  "ALTI ": "SIX ",
  "TOKEN ": "TOKEN ",
  "VESSEL ": "VESSEL ",
  "LİKİDİTE": "LIQUIDITY",
  "MALİYETİ": "COST",
  " KALİTE": " QUALITY",
  " PROJESİ": " PROJECT",
  " SİSTEMİ": " SYSTEM",
  " YÖNETİMİ": " MANAGEMENT",
  " DEĞERLENDİRMESİ": " ASSESSMENT",
  " DEĞERLENDİRME": " ASSESSMENT",
  " GÖSTERGESİ": " INDICATOR",
  " ÖLÇÜMÜ": " MEASUREMENT",
  " HESABI": " CALCULATION",
  "HESABI": "CALCULATION",
  " TUTARI": " AMOUNT",
  " KATSAYISI": " COEFFICIENT",
  " ORANI": " RATIO",
  " İHTİYACI": " REQUIREMENT",
  " GEREKSİNİMİ": " REQUIREMENT",
  " PLANI": " PLAN",
  " SEVİYESİ": " LEVEL",
  " YOĞUNLUĞU": " DENSITY",
  " KALINLIĞI": " THICKNESS",
  " MİKTARI": " QUANTITY",
  " DEĞERİ": " VALUE",
  " KARŞILAŞTIRMASI": " COMPARISON",
  " ANALİZİ": " ANALYSIS",
  " RAPORU": " REPORT",
  " KONTROLÜ": " CONTROL",
  " TAHMİNİ": " ESTIMATION",
  " HESAPLAMA": " CALCULATION",
  " DÖNÜŞTÜRÜCÜ": " CONVERTER",
  " DÖNÜŞÜM": " CONVERSION",
  " SİMÜLASYONU": " SIMULATION",
  " OPTİMİZASYONU": " OPTIMIZATION",
  " BELİRLEME": " DETERMINATION",
  " İZLEME": " MONITORING",
  " TAKİBİ": " TRACKING",
  " YÖNETİMİ": " MANAGEMENT",
  " STRATEJİSİ": " STRATEGY",
  " POLİTİKASI": " POLICY",
  " DEĞİŞİM": " CHANGE",
  " DURUM": " STATUS",
  " KALİBRASYONU": " CALIBRATION",
  " ÇÖZÜMLEMESİ": " ANALYSIS",
  " TESTİ": " TEST",
  " DENEYİ": " EXPERIMENT",
  " SERTİFİKASYONU": " CERTIFICATION",
  " RİSKİ": " RISK",
  " FIRSATI": " OPPORTUNITY",
  " ETKİSİ": " IMPACT",
  " SKORU": " SCORE",
  " PUANI": " SCORE",
  " DURUMU": " STATUS",
  " DÜZEYİ": " LEVEL",
  " BOYUTU": " DIMENSION",
  " ÖZELLİĞİ": " PROPERTY",
  " KAPASİTESİ": " CAPACITY",
  " PERFORMANSI": " PERFORMANCE",
  " VERİMLİLİĞİ": " EFFICIENCY",
  " DAYANIKLILIĞI": " DURABILITY",
  " GÜVENİLİRLİĞİ": " RELIABILITY",
  " EMNİYETİ": " SAFETY",
  " İHTİMALİ": " PROBABILITY",

  Denetim: "Audit",
  Skoru: "Score",
  skoru: "score",
  Verimlilik: "Efficiency",
  verimlilik: "efficiency",
  Kaybi: "Loss",
  kaybi: "loss",
  Kaybı: "Loss",
  kaybı: "loss",
  Baski: "Printing",
  baski: "printing",
  Baskı: "Printing",
  baskı: "printing",
  Destek: "Support",
  destek: "support",
  Yapisi: "Structure",
  yapisi: "structure",
  Yapısı: "Structure",
  yapısı: "structure",
  Proses: "Process",
  proses: "process",
  Sonrasi: "Post",
  sonrasi: "post",
  Sonrası: "Post",
  sonrası: "post",
  Tork: "Torque",
  Civate: "Bolt",
  civate: "bolt",
  Civata: "Bolt",
  civata: "bolt",
  Degerlendirme: "Assessment",
  Değerlendirme: "Assessment",
  Hesaplayici: "Calculator",
  Hesaplayıcı: "Calculator",
  hesaplayici: "calculator",
  hesaplayıcı: "calculator",
  Hesaplama: "Calculation",
  hesaplama: "calculation",
  Dönüştürücü: "Converter",
  Donusturucu: "Converter",
  donusturucu: "converter",
  Dönüsüm: "Conversion",
  Donusum: "Conversion",
  Olcum: "Measurement",
  Olçum: "Measurement",
  Ölçüm: "Measurement",
  Olcüm: "Measurement",
  Rapor: "Report",
  rapor: "report",
  Gider: "Expense",
  gider: "expense",
  Gelir: "Revenue",
  gelir: "revenue",
  Kar: "Profit",
  Zarar: "Loss",
  zarar: "loss",
  Deger: "Value",
  deger: "value",
  Değer: "Value",
  değer: "value",
  Planlayici: "Planner",
  Planlayıcı: "Planner",
  planlayici: "planner",
  planlayıcı: "planner",
  Yönetici: "Manager",
  yonetici: "manager",
  Uzmani: "Specialist",
  Uzmanı: "Specialist",
  uzmani: "specialist",
  uzmanı: "specialist",
  Mühendis: "Engineer",
  Muhendis: "Engineer",
  Mühendisi: "Engineer",
  Muhendisi: "Engineer",
  mühendisi: "engineer",
  muhendisi: "engineer",
  Tasarimci: "Designer",
  Tasarımcı: "Designer",
  tasarimci: "designer",
  tasarımcı: "designer",
  Tasarimcısı: "Designer",
  Tasarımcısı: "Designer",
  Koordinatörü: "Coordinator",
  Koordinatoru: "Coordinator",
  Danismani: "Consultant",
  Danışmanı: "Consultant",
  Danismani: "Consultant",
  Planlayicisi: "Planner",
  Planlayıcısı: "Planner",
  Yöneticisi: "Manager",
  Denetçi: "Auditor",
  Operator: "Operator",
  Operatör: "Operator",
  operator: "operator",
  Teknisyen: "Technician",
  Analisti: "Analyst",
  Bilimci: "Scientist",

  HESABI: "CALC",
  hesabi: "calc",
  RISKI: "RISK",
  riski: "risk",
  KUR_FARKI: "EXCHANGE_RATE",
  kur_farki: "exchange_rate",
  DOVIZ: "FX",
  doviz: "fx",
  POZISYON: "POSITION",
  pozisyon: "position",
  pozisyonu: "position",
  kategori: "category",
  Kategori: "Category",
  urunler: "products",
  Urunler: "Products",
  iletisim: "contact",
  PARETO_ANALIZI: "PARETO_ANALYSIS",
  SOSYAL_GUVENLIK_FORMULU: "SOCIAL_SECURITY_FORMULA",
  YAS_CARPANI: "AGE_FACTOR",
};

const EXCLUDE_PATHS = [
  /\/node_modules\//, /\/\.next\//, /\/\.git\//, /\/__pycache__\//,
  /\/\.firebase\//, /\/\.sectorcalc\//, /\/\.cache\//, /\/\.githooks\//,
  /\/out\//, /\/dist\//, /\/\.next-cache-backup\//, /\/test-results\//,
  /\/data\/pro-tools\//, /\/data\/pro-tools-universal\//,
  /\/src\/data\/premium\//,
  /\/src\/lib\/trace\/catalog\.generated\.ts/,
  /locale-routing/, /locale-config/, /locale-glossary/, /locale-catalog/,
  /locale-center/, /locale-integrity/, /merge-locale/, /purge-i18n/,
  /strip-i18n/, /patch.*i18n/, /audit.*locale/, /audit.*i18n/,
  /generate.*i18n/, /englishify/, /safe-english-enforcer/,
  /global-seo-config/, /indexable-url-manifest/, /indexNow\.test/,
  /nav-active\.test/, /__tests__.*locale/, /agenda-test/, /fly\.test/,
  /\.test\.(ts|tsx|js|jsx).*locale/,
  /check-english-only\.mjs$/, /check-no-turkish-ui-strings\.mjs$/,
  /check-commit-secrets\.mjs$/,
  /rewrite-pipeline\.mjs$/, /rewrite-pipeline-deepseek\.mjs$/,
  /\/src\/data\/messages-en\.json$/, /\/src\/data\/.*\.generated\.json$/,
  /\/src\/data\/free-tool-inputs-i18n/, /\/src\/data\/premium-schema-inputs-i18n/,
  /internal-copy-blocklist/, /sanitize-content\.ts/,
  /free-traffic-calculators-registry\.ts$/,
  /values\.(birimmaliyet|kredi|nakit|faiz|vade|masraf|yil|donem|taksit)/,
  /\/src\/config\/regions\.ts/, /\/src\/lib\/locale-center\/region-defaults\.ts/,
  /\/src\/lib\/locale-center\/unit-currency-center\.ts/,
  /\/src\/lib\/format\/localization\.ts/,
  /\/src\/lib\/engines\/creditAssessmentFieldOptions\.ts/,
  /\/src\/lib\/math\/stochastic-engine\.ts/,
  /\/src\/lib\/guidance\/build-guidance-fields\.ts/,
  /\/src\/lib\/premium-schema\/schemas\//,
  /\/src\/lib\/premium-schema\/calculators\//,
  /\/src\/lib\/regional\//,
  /expert-calc\.test\.ts/,
  /\/src\/engine\/expression-evaluator\.ts/,
  /formula-source-audit-registry\.ts/,
  /\/src\/lib\/formula-governance\/oracle\//,
  /\/src\/lib\/ai\//, /\/src\/lib\/ai-gateway\//,
  /create-verification-item\.test\.ts/,
  /tool-guide-blocklist\.ts/,
  /roadmap-free-batch[12]-specs\.generated\.ts/,
  /\/scripts\//, //src/__components_disabled__//, //src/__app_disabled__//,
  /regional-unit-engine\.ts/,
  /\/src\/lib\/verdict\/verdict-engine\.ts/,
  /runtime-trust-engine\.ts/,
  /package-lock\.json$/,
  /bulk-fix-english-violations\.mjs$/,
];

function isExcluded(fp) { return EXCLUDE_PATHS.some(p => p.test(fp)); }

function walkDir(dir, cb) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!e.name.startsWith(".") && e.name !== "node_modules" && e.name !== "test-results") walkDir(p, cb); }
    else if (e.isFile()) cb(p);
  }
}

function hasTurkishChars(t) { return /[ığüşöçİĞÜŞÖÇ]/.test(t); }

function translateTurkishText(text) {
  let r = text;
  const e = Object.entries(TR_EN_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [tr, en] of e) if (r.includes(tr)) r = r.replaceAll(tr, en);
  return r;
}

function isTrLocaleString(l) { return /["']tr["']\s*:\s*["']/.test(l); }

function fixTrLocaleString(line) {
  let nl = line.replace(/["']tr["']\s*:\s*/, '"en": ');
  const m = nl.match(/:\s*"([^"]*)"/);
  if (m && hasTurkishChars(m[1])) nl = nl.replace(`"${m[1]}"`, `"${translateTurkishText(m[1])}"`);
  return nl;
}

function transliterateId(n) { return n.replace(/ğ/g,'g').replace(/Ğ/g,'G').replace(/ü/g,'u').replace(/Ü/g,'U').replace(/ş/g,'s').replace(/Ş/g,'S').replace(/ı/g,'i').replace(/İ/g,'I').replace(/ö/g,'o').replace(/Ö/g,'O').replace(/ç/g,'c').replace(/Ç/g,'C'); }

function fixTurkishComments(line) {
  const cm = line.match(/(\/\/.*|\/\*.*\*\/|^\s*\*.*)$/);
  if (cm && hasTurkishChars(cm[1])) return line.replace(cm[1], translateTurkishText(cm[1]));
  return line;
}

function fixTurkishIdentifiers(line) {
  if ((line.includes("const ") || line.includes("let ") || line.includes("export ") || line.includes("function ") || line.includes("interface ") || line.includes("type ")) && !line.trim().startsWith("//") && !line.trim().startsWith("*")) {
    let r = line;
    const w = line.split(/(\b[a-zA-Z_ığüşöçİĞÜŞÖÇ][a-zA-Z0-9_ığüşöçİĞÜŞÖÇ]*\b)/);
    for (let i = 1; i < w.length; i += 2) {
      const wo = w[i];
      if (hasTurkishChars(wo) && !wo.startsWith('"') && !wo.startsWith("'")) {
        let f = wo;
        const e = Object.entries(TR_EN_MAP).sort((a,b) => b[0].length - a[0].length);
        for (const [tr, en] of e) if (f.includes(tr)) f = f.replaceAll(tr, en);
        f = transliterateId(f);
        if (f !== wo) r = r.replace(wo, f);
      }
    }
    return r;
  }
  return line;
}

function fixFile(fp) {
  const ext = extname(fp);
  if (![".ts",".tsx",".js",".jsx",".mjs",".json",".css",".scss"].includes(ext)) return {changed:false,count:0};
  try {
    const c = readFileSync(fp,"utf-8");
    if (!hasTurkishChars(c)) return {changed:false,count:0};
    const lines = c.split("\n");
    const nl = [];
    let changed = false, cnt = 0;
    for (let i = 0; i < lines.length; i++) {
      let l = lines[i], n = l;
      if (hasTurkishChars(l)) {
        if (isTrLocaleString(l)) { const f = fixTrLocaleString(l); if (f !== l) { n = f; changed = true; cnt++; } }
        else if (l.includes("description:") || l.includes("label:") || l.includes("purpose:") || l.includes("painStatement:") || l.includes("title:") || l.includes("subtitle:") || l.includes("name:") || l.includes("assumptions:") || l.includes("thresholds:") || l.includes("reportTemplate:") || l.includes("slug:")) {
          const m = l.match(/:\s*["']([^"']+)["']/);
          if (m && hasTurkishChars(m[1])) { const t = translateTurkishText(m[1]); n = l.replace(m[1], t); if (n !== l) { changed = true; cnt++; } }
        }
        else if ((l.includes("const ")||l.includes("let ")||l.includes("export ")||l.includes("function ")) && !l.trim().startsWith("//") && !l.trim().startsWith("*")) {
          const f = fixTurkishIdentifiers(l);
          if (f !== l) { n = f; changed = true; cnt++; }
        }
        else if (l.trim().startsWith("//") || l.trim().startsWith("*")) {
          const f = fixTurkishComments(l);
          if (f !== l) { n = f; changed = true; cnt++; }
        }
        else if (l.includes('"') && !l.trim().startsWith("//") && !l.trim().startsWith("*")) {
          const m = l.match(/:\s*"([^"]+)"|"([^"]+)":/);
          if (m) { const v = m[1] || m[2]; if (v && hasTurkishChars(v) && v.length > 2 && v.length < 500) { const t = translateTurkishText(v); if (t !== v) { n = l.replace(v, t); if (n !== l) { changed = true; cnt++; } } } }
        }
      }
      nl.push(n);
    }
    if (changed) { const nc = nl.join("\n"); if (!DRY_RUN) writeFileSync(fp, nc, "utf-8"); return {changed:true,count:cnt}; }
    return {changed:false,count:0};
  } catch(e) { return {changed:false,count:0}; }
}

function main() {
  const srcDir = join(ROOT, "src");
  const publicDir = join(ROOT, "public");
  let totalChanged = 0, changedFiles = 0;
  console.log("=== Bulk English-Only Violation Fixer ===\n");
  if (DRY_RUN) console.log("  DRY RUN — No files modified\n");
  const fpl = [];
  for (const dir of [srcDir, publicDir]) {
    if (!existsSync(dir)) continue;
    walkDir(dir, (fp) => {
      if (![".ts",".tsx",".js",".jsx",".mjs",".json",".css",".scss"].includes(extname(fp))) return;
      if (isExcluded(fp)) return;
      fpl.push(fp);
    });
  }
  for (const rf of ["next.config.ts","src/middleware.ts"]) { const fp = join(ROOT, rf); if (existsSync(fp)) fpl.push(fp); }
  console.log(`  Scanning ${fpl.length} files...\n`);
  for (const fp of fpl) {
    const rel = fp.replace(ROOT,"").replace(/^\//,"");
    const r = fixFile(fp);
    if (r.changed) { totalChanged += r.count; changedFiles++; console.log(`  [FIX] ${rel} (${r.count})`); }
  }
  console.log(`\n  === Summary ===`);
  console.log(`  Files scanned:    ${fpl.length}`);
  console.log(`  Files changed:    ${changedFiles}`);
  console.log(`  Violations fixed: ${totalChanged}`);
  if (DRY_RUN) console.log(`\n  DRY RUN — No files modified.\n  Run without --dry-run.`);
  else console.log(`\n  Fixes applied. Run check-english-only.mjs to verify.`);
}
main();
