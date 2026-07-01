#!/usr/bin/env node
/**
 * P34 CI gate — premium calculator experience contract (no dead tabs, no legacy panels).
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SRC = join(ROOT, "src");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const FORBIDDEN_UI = [
  "Klasik form",
  "Defter Kayıtları",
  "Defter kayıtları",
  "Karar Masası",
  "Karar masası",
];

const FORBIDDEN_STATIC_TAB = "Hesaplama özeti";

const REQUIRED_FILES = [
  "src/lib/calculator-experience/calculator-experience-types.ts",
  "src/lib/calculator-experience/resolve-calculator-experience.ts",
  "src/components/tools/PremiumCalculatorShell.tsx",
  "src/styles/premium-calculator-shell.css",
  "scripts/audit-premium-calculator-ux.mjs",
];

const REQUIRED_I18N_KEYS = [
  "calculator.premiumEyebrow",
  "calculator.mode.label",
  "calculator.mode.quick",
  "calculator.mode.expert",
  "calculator.sections.inputs",
  "calculator.sections.summary",
  "calculator.sections.result",
  "calculator.emptyState.enterValues",
];

let failures = 0;
let passes = 0;

function pass(msg) {
  passes += 1;
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  failures += 1;
  console.error(`FAIL: ${msg}`);
}

function read(rel) {
  return readFileSync(join(ROOT, rel), "utf8");
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, acc);
    } else if (/\.(tsx?|jsx?|css)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function grepInFiles(files, pattern) {
  const hits = [];
  for (const file of files) {
    const rel = file.replace(`${ROOT}/`, "");
    if (!rel.startsWith("src/app") && !rel.startsWith("src/components")) continue;
    const text = readFileSync(file, "utf8");
    if (pattern.test(text)) {
      hits.push(rel);
    }
  }
  return hits;
}

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

// 1. Required contract files
for (const rel of REQUIRED_FILES) {
  if (existsSync(join(ROOT, rel))) {
    pass(`contract file exists: ${rel}`);
  } else {
    fail(`missing contract file: ${rel}`);
  }
}

// 2. CSS imported
const siteStyles = read("src/app/site-styles.ts");
if (siteStyles.includes("premium-calculator-shell.css")) {
  pass("premium-calculator-shell.css imported in site-styles.ts");
} else {
  fail("premium-calculator-shell.css not imported in site-styles.ts");
}

// 3. package.json script
const pkg = JSON.parse(read("package.json"));
if (pkg.scripts?.["audit:premium-ux"]) {
  pass("audit:premium-ux script registered");
} else {
  fail("audit:premium-ux script missing from package.json");
}

// 4. i18n keys in all locales
for (const locale of LOCALES) {
  const messages = JSON.parse(read(`messages/${locale}.json`));
  for (const key of REQUIRED_I18N_KEYS) {
    if (getNested(messages, key)) {
      pass(`${locale}: ${key}`);
    } else {
      fail(`${locale}: missing ${key}`);
    }
  }
}

// 5. Forbidden legacy UI strings in src/app + src/components
const uiFiles = walk(SRC);
for (const term of FORBIDDEN_UI) {
  const hits = uiFiles.filter((f) => {
    const rel = f.replace(`${ROOT}/`, "");
    if (!rel.startsWith("src/app") && !rel.startsWith("src/components")) return false;
    return readFileSync(f, "utf8").includes(term);
  });
  if (hits.length === 0) {
    pass(`forbidden UI string removed: ${term}`);
  } else {
    fail(`forbidden UI string "${term}" in: ${hits.join(", ")}`);
  }
}

// 6. Static "Hesaplama özeti" tab in components (messages OK)
const summaryHits = grepInFiles(uiFiles, /Hesaplama özeti/);
if (summaryHits.length === 0) {
  pass("no static Hesaplama özeti tab text in src/app or src/components");
} else {
  fail(`static Hesaplama özeti found in: ${summaryHits.join(", ")}`);
}

// 7. SmartFormShell — single unified form (no quick/expert mode switch)
const shell = read("src/components/smart-form/SmartFormShell.tsx");
const premiumShell = read("src/components/tools/PremiumCalculatorShell.tsx");
if (!shell.includes("sc-mode-switch") && !shell.includes("trustTraceContent") && !shell.includes('"trust"')) {
  pass("SmartFormShell uses single unified form (no mode switch or dead trust tab)");
} else if (shell.includes("trustTraceContent") || shell.includes('"trust"')) {
  fail("SmartFormShell still references trustTraceContent or trust view mode");
} else {
  fail("SmartFormShell still has quick/expert mode switch");
}

// 8. PremiumCalculatorShell — dual panel without mode toggle
if (premiumShell.includes("hasCalculated") && !premiumShell.includes("sc-mode-switch")) {
  pass("PremiumCalculatorShell uses dual workspace without mode toggle");
} else {
  fail("PremiumCalculatorShell missing hasCalculated or still has mode toggle");
}

// DynamicPremiumCalculator has been removed — replaced by PremiumSchemaToolForm
// PremiumSchemaToolForm uses DynamicFormEngine which has shell integration built-in.

// 10. OEE guidance — not machine-time generic
const taxonomy = read("src/lib/guidance/reference-graphic-taxonomy.ts");
if (taxonomy.includes('"cnc-oee-loss": "oee-flow"') || taxonomy.includes("cnc-oee-loss")) {
  const oeeBlock = taxonomy.match(/cnc-oee-loss[\s\S]{0,80}/);
  if (oeeBlock && oeeBlock[0].includes("oee-flow")) {
    pass("cnc-oee-loss mapped to oee-flow guidance template");
  } else {
    fail("cnc-oee-loss not mapped to oee-flow in reference-graphic-taxonomy.ts");
  }
} else {
  fail("cnc-oee-loss missing from reference-graphic-taxonomy.ts");
}

if (existsSync(join(ROOT, "src/components/guidance/templates/OeeFlowGraphic.tsx"))) {
  pass("OeeFlowGraphic template exists");
} else {
  fail("OeeFlowGraphic template missing");
}

// 11. GuidedReferenceGraphic accepts activeFieldKey (via props)
const guided = read("src/components/guidance/GuidedReferenceGraphic.tsx");
if (guided.includes("activeFieldKey")) {
  pass("GuidedReferenceGraphic supports activeFieldKey");
} else {
  fail("GuidedReferenceGraphic missing activeFieldKey");
}

// 12. Hardcoded TR mode tab text outside messages
const hardcodedBasit = grepInFiles(
  uiFiles,
  />(Basit|Uzman)<|"Basit"|"Uzman"|'Basit'|'Uzman'/,
).filter((rel) => !rel.includes("messages"));
if (hardcodedBasit.length === 0) {
  pass("no hardcoded Basit/Uzman tab text in src/app or src/components");
} else {
  fail(`hardcoded Basit/Uzman in: ${hardcodedBasit.join(", ")}`);
}

// 13. Premium page mobile CSS
const shellCss = read("src/styles/premium-calculator-shell.css");
if (shellCss.includes("@media (max-width: 768px)") && shellCss.includes(".sc-tool-workspace")) {
  pass("premium calculator shell has responsive grid CSS");
} else {
  fail("premium calculator shell missing mobile grid CSS");
}

// 14. Empty state copy key used in shells
if (
  premiumShell.includes('emptyState.enterValues') &&
  shell.includes('emptyState.enterValues')
) {
  pass("empty state i18n wired in premium shells");
} else {
  fail("empty state i18n not wired in one or more shells");
}

console.log(`\nPremium UX audit: ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
