#!/usr/bin/env node
/**
 * CI gate: calculator copy i18n integrity + banned analyzer terminology in visible copy.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];
const NON_EN_LOCALES = LOCALES.filter((l) => l !== "en");
function loadMergedCatalogSlugs() {
  const base = JSON.parse(
    readFileSync(join(ROOT, "src/lib/tools/free-traffic-catalog.generated.json"), "utf8"),
  );
  const batch1 = JSON.parse(
    readFileSync(join(ROOT, "src/lib/tools/roadmap-free-batch1-catalog.generated.json"), "utf8"),
  );
  const batch2 = JSON.parse(
    readFileSync(join(ROOT, "src/lib/tools/roadmap-free-batch2-catalog.generated.json"), "utf8"),
  );
  const slugs = [...base, ...batch1, ...batch2].map((t) => t.slug);
  return [...new Set(slugs)];
}

const BATCH1_I18N = JSON.parse(
  readFileSync(join(ROOT, "src/data/roadmap-free-batch1-i18n.generated.json"), "utf8"),
);
const BATCH2_I18N = JSON.parse(
  readFileSync(join(ROOT, "src/data/roadmap-free-batch2-i18n.generated.json"), "utf8"),
);
const CATALOG_I18N = JSON.parse(
  readFileSync(join(ROOT, "src/data/free-tool-catalog-i18n.generated.json"), "utf8"),
);

const SLUGS = loadMergedCatalogSlugs();

const BANNED_VISIBLE = [
  /\bAnalyzers?\b/i,
  /\bAnalysis\b/i,
  /\bAnalyze\b/i,
  /\banalyses\b/i,
  /\banalizör/i,
  /\banalizi\b/i,
  /\banaliz\b/i,
  /\bAnalyseurs?\b/i,
  /\bAnalysatoren?\b/i,
  /\bAnalizadores?\b/i,
  /\bAnálisis\b/i,
  /\bتحليل\b/,
  /\bمحلل\b/,
];

const EN_CARD_LEAKS = [
  "Roofing Area Calculator",
  "Stair Calculator",
  "Drywall Calculator",
  "Estimate roof",
  "Calculate floor",
  "with waste factor",
];

const SKIP_PATH_SUFFIXES = [
  "Analyzer",
  "Analyzers",
  "cncQuoteRiskAnalyzer",
  "changeOrderImpactAnalyzer",
  "weldingBidRiskAnalyzer",
  "millworkBidRiskAnalyzer",
  "routeOptimizationAnalyzer",
  "cropYieldLossAnalyzer",
  "feedEfficiencyAnalyzer",
];

const SKIP_PATH_PREFIXES = ["nav.getPro", "nav.unlockPro", "osGate", "auditEngine"];

const SOURCE_SCAN_FILES = [
  "src/lib/seo/programmatic-seo-pages.ts",
  "src/lib/catalog/build-catalog-groups.ts",
  "src/lib/i18n/locale-cta.ts",
  "src/components/catalog/CategoryExplorer.tsx",
  "src/components/account/RecentReportsPanel.tsx",
  "src/data/tool-definitions/project-cost-estimator.ts",
  "src/data/tool-definitions/cnc-minimum-safe-quote-analyzer.ts",
];

function loadMessages(locale) {
  return JSON.parse(readFileSync(join(ROOT, "messages", `${locale}.json`), "utf8"));
}

function flatten(obj, prefix = "") {
  const out = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      out.push([path, value]);
      continue;
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
      out.push(...flatten(value, path));
    }
  }
  return out;
}

function shouldSkipPath(path) {
  if (SKIP_PATH_PREFIXES.some((p) => path.startsWith(p))) {
    return true;
  }
  const leaf = path.split(".").pop() ?? path;
  if (SKIP_PATH_SUFFIXES.some((s) => leaf.includes(s))) {
    return true;
  }
  return false;
}

function scanText(label, text, failures) {
  for (const banned of BANNED_VISIBLE) {
    if (banned.test(text)) {
      failures.push(`${label} → "${text.slice(0, 100)}"`);
      break;
    }
  }
}

function resolveFreeToolCopy(locale, slug) {
  const messages = loadMessages(locale);
  const fromMessages = messages.freeToolContent?.[slug];
  if (fromMessages?.title && fromMessages?.description) {
    return { title: fromMessages.title, description: fromMessages.description };
  }
  const bundle =
    CATALOG_I18N[locale]?.[slug] ?? BATCH1_I18N[locale]?.[slug] ?? BATCH2_I18N[locale]?.[slug];
  if (bundle?.title && bundle?.description) {
    return { title: bundle.title, description: bundle.description };
  }
  if (locale !== "en") {
    const enMessages = loadMessages("en");
    const enEntry = enMessages.freeToolContent?.[slug];
    if (enEntry?.title && enEntry?.description) {
      return { title: enEntry.title, description: enEntry.description };
    }
  }
  return null;
}

function scanSourceFile(relPath, text, failures) {
  const literalRe = /"([^"\\]|\\.)*"/g;
  let match;
  while ((match = literalRe.exec(text)) !== null) {
    const literal = match[0].slice(1, -1);
    if (literal.includes("-analyzer") || literal.includes("premiumAnalyzerLinks")) {
      continue;
    }
    scanText(relPath, literal, failures);
  }
}

const failures = [];

for (const locale of NON_EN_LOCALES) {
  const messages = loadMessages(locale);

  for (const slug of SLUGS) {
    const entry = resolveFreeToolCopy(locale, slug);
    if (!entry?.title || !entry?.description) {
      failures.push(`${locale}: missing localized copy for ${slug} (title/description)`);
      continue;
    }
    if (locale === "tr") {
      for (const leak of EN_CARD_LEAKS) {
        if (entry.title.includes(leak) || entry.description.includes(leak)) {
          failures.push(`${locale}: English card leak ${slug} → "${leak}"`);
        }
      }
    }
    scanText(`${locale}: freeTool.${slug}`, `${entry.title} ${entry.description}`, failures);
  }

  for (const [path, value] of flatten(messages)) {
    if (shouldSkipPath(path)) {
      continue;
    }
    scanText(`${locale}: messages.${path}`, value, failures);
  }
}

for (const relPath of SOURCE_SCAN_FILES) {
  const text = readFileSync(join(ROOT, relPath), "utf8");
  scanSourceFile(relPath, text, failures);
}

console.log("audit:calculator-copy");
console.log(`catalog slugs: ${SLUGS.length}`);
if (failures.length === 0) {
  console.log("PASS — no blocking issues");
  process.exit(0);
}

console.log(`FAIL — ${failures.length} issue(s):`);
for (const line of failures.slice(0, 50)) {
  console.log(`  - ${line}`);
}
if (failures.length > 50) {
  console.log(`  - … +${failures.length - 50} more`);
}
process.exit(1);
