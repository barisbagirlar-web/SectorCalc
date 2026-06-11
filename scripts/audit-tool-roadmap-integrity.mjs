#!/usr/bin/env node
/**
 * CI gate: strategic premium + free traffic roadmap integrity.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const BANNED_PUBLIC = [
  /\bAnalyzers?\b/i,
  /\bAnalysis\b/i,
  /\bAnalyze\b/i,
  /\banalyses\b/i,
  /\banalizör/i,
  /\banalizi\b/i,
  /\banaliz\b/i,
  /\bSihirbaz\b/i,
  /\bWizard\b/i,
  /\bPremium analiz/i,
  /\bPremium analysis\b/i,
  /\bAnalyseurs?\b/i,
  /\bAnalysatoren?\b/i,
  /\bAnalizadores?\b/i,
  /\bAnálisis\b/i,
  /\bتحليل\b/,
  /\bمحلل\b/,
];

const TRAFFIC_ALLOWED = new Set(["very-high", "high", "medium", "low"]);
const PREMIUM_STATUS_ALLOWED = new Set(["live", "beta", "planned"]);
const FREE_STATUS_ALLOWED = new Set(["live", "planned"]);
const PREMIUM_PHASES = new Set([1, 2, 3, 4]);

function loadLiveSlugs() {
  const traffic = JSON.parse(
    readFileSync(join(ROOT, "src/lib/tools/free-traffic-catalog.generated.json"), "utf8"),
  ).map((t) => t.slug);
  const batch1 = JSON.parse(
    readFileSync(join(ROOT, "src/lib/tools/roadmap-free-batch1-catalog.generated.json"), "utf8"),
  ).map((t) => t.slug);
  const batch2 = JSON.parse(
    readFileSync(join(ROOT, "src/lib/tools/roadmap-free-batch2-catalog.generated.json"), "utf8"),
  ).map((t) => t.slug);
  const revenueFree = [];
  const revenuePaid = [];
  const revenueText = readFileSync(join(ROOT, "src/lib/tools/revenue-tools.ts"), "utf8");
  for (const m of revenueText.matchAll(/freeSlug:\s*"([^"]+)"/g)) revenueFree.push(m[1]);
  for (const m of revenueText.matchAll(/paidSlug:\s*"([^"]+)"/g)) revenuePaid.push(m[1]);
  const schemaDir = join(ROOT, "src/lib/premium-schema/schemas");
  const schemaSlugs = readdirSync(schemaDir)
    .filter((name) => name.endsWith(".ts") && name !== "index.ts")
    .map((name) => {
      const text = readFileSync(join(schemaDir, name), "utf8");
      const match = text.match(/\bid:\s*"([^"]+)"/);
      if (!match) {
        throw new Error(`Missing schema id in ${name}`);
      }
      return match[1];
    });
  return new Set([...traffic, ...batch1, ...batch2, ...revenueFree, ...revenuePaid, ...schemaSlugs]);
}

function extractConstArray(tsPath, constName) {
  const text = readFileSync(join(ROOT, tsPath), "utf8");
  const marker = `export const ${constName}`;
  const start = text.indexOf(marker);
  if (start === -1) throw new Error(`Missing ${constName} in ${tsPath}`);
  const eq = text.indexOf("=", start);
  const open = text.indexOf("[", eq);
  let depth = 0;
  for (let i = open; i < text.length; i += 1) {
    if (text[i] === "[") depth += 1;
    if (text[i] === "]") {
      depth -= 1;
      if (depth === 0) {
        return JSON.parse(text.slice(open, i + 1));
      }
    }
  }
  throw new Error(`Unterminated array for ${constName}`);
}

function hasBanned(text) {
  return BANNED_PUBLIC.some((re) => re.test(text));
}

function localeRecordComplete(record, label, failures, fieldName) {
  if (!record || typeof record !== "object") {
    failures.push(`${label}: missing ${fieldName} record`);
    return;
  }
  for (const locale of LOCALES) {
    const value = record[locale];
    if (typeof value !== "string" || value.trim().length === 0) {
      failures.push(`${label}: ${fieldName}.${locale} empty`);
    }
  }
}

function auditPremium(items, liveSlugs, rows) {
  const failures = [];
  rows.push(["Premium item count", String(items.length), items.length === 23 ? "PASS" : "FAIL"]);

  const ids = new Set();
  const slugs = new Set();
  let localeOk = true;
  let forbiddenOk = true;
  let plannedLinkOk = true;
  let liveSlugOk = true;
  let mappedRouteOk = true;
  let phaseOk = true;
  let scoreOk = true;
  let statusOk = true;

  for (const item of items) {
    if (ids.has(item.id)) failures.push(`Duplicate premium id: ${item.id}`);
    if (slugs.has(item.slug)) failures.push(`Duplicate premium slug: ${item.slug}`);
    ids.add(item.id);
    slugs.add(item.slug);

    if (!PREMIUM_PHASES.has(item.phase)) phaseOk = false;
    if (typeof item.score !== "number" || item.score < 0 || item.score > 10) scoreOk = false;
    if (!PREMIUM_STATUS_ALLOWED.has(item.status)) statusOk = false;

    localeRecordComplete(item.title, item.id, failures, "title");
    localeRecordComplete(item.shortDescription, item.id, failures, "shortDescription");
    localeRecordComplete(item.pain, item.id, failures, "pain");
    localeRecordComplete(item.publicPromise, item.id, failures, "publicPromise");

    for (const locale of LOCALES) {
      const blob = [item.title?.[locale], item.shortDescription?.[locale], item.pain?.[locale], item.publicPromise?.[locale]]
        .filter(Boolean)
        .join(" ");
      if (hasBanned(blob)) {
        forbiddenOk = false;
        failures.push(`${item.id} ${locale}: banned terminology in public copy`);
      }
    }

    if (item.status === "planned" && item.mappedLiveSlug) {
      plannedLinkOk = false;
      failures.push(`${item.id}: planned item must not set mappedLiveSlug`);
    }
    if (item.status === "live" && !item.mappedLiveSlug) {
      liveSlugOk = false;
      failures.push(`${item.id}: live item missing mappedLiveSlug`);
    }
    if (item.mappedLiveSlug && !liveSlugs.has(item.mappedLiveSlug)) {
      mappedRouteOk = false;
      failures.push(`${item.id}: mappedLiveSlug not found: ${item.mappedLiveSlug}`);
    }
  }

  if (failures.some((f) => f.includes("empty"))) localeOk = false;

  rows.push(["Premium duplicate id", "0", ids.size === items.length ? "PASS" : "FAIL"]);
  rows.push(["Premium duplicate slug", "0", slugs.size === items.length ? "PASS" : "FAIL"]);
  rows.push(["Premium locale completeness", "-", localeOk ? "PASS" : "FAIL"]);
  rows.push(["Premium forbidden terminology", "-", forbiddenOk ? "PASS" : "FAIL"]);
  rows.push(["Premium planned mappedLiveSlug", "-", plannedLinkOk ? "PASS" : "FAIL"]);
  rows.push(["Premium live mappedLiveSlug present", "-", liveSlugOk ? "PASS" : "FAIL"]);
  rows.push(["Premium mapped route exists", "-", mappedRouteOk ? "PASS" : "FAIL"]);
  rows.push(["Premium phase 1-4", "-", phaseOk ? "PASS" : "FAIL"]);
  rows.push(["Premium score 0-10", "-", scoreOk ? "PASS" : "FAIL"]);
  rows.push(["Premium status values", "-", statusOk ? "PASS" : "FAIL"]);

  return failures;
}

function auditFree(items, liveSlugs, rows) {
  const failures = [];
  rows.push(["Free roadmap item count", String(items.length), items.length === 200 ? "PASS" : "FAIL"]);

  const ids = new Set();
  const slugs = new Set();
  let localeOk = true;
  let forbiddenOk = true;
  let plannedLinkOk = true;
  let liveSlugOk = true;
  let mappedRouteOk = true;
  let trafficOk = true;
  let statusOk = true;

  for (const item of items) {
    if (ids.has(item.id)) failures.push(`Duplicate free id: ${item.id}`);
    if (slugs.has(item.slug)) failures.push(`Duplicate free slug: ${item.slug}`);
    ids.add(item.id);
    slugs.add(item.slug);

    if (!TRAFFIC_ALLOWED.has(item.trafficPotential)) trafficOk = false;
    if (!FREE_STATUS_ALLOWED.has(item.status)) statusOk = false;

    localeRecordComplete(item.title, item.id, failures, "title");
    localeRecordComplete(item.categoryName, item.id, failures, "categoryName");
    localeRecordComplete(item.targetAudience, item.id, failures, "targetAudience");

    for (const locale of LOCALES) {
      const blob = [item.title?.[locale], item.categoryName?.[locale], item.targetAudience?.[locale]]
        .filter(Boolean)
        .join(" ");
      if (hasBanned(blob)) {
        forbiddenOk = false;
        failures.push(`${item.id} ${locale}: banned terminology`);
      }
    }

    if (item.status === "planned" && item.mappedLiveSlug) {
      plannedLinkOk = false;
      failures.push(`${item.id}: planned item must not set mappedLiveSlug`);
    }
    if (item.status === "live" && !item.mappedLiveSlug) {
      liveSlugOk = false;
      failures.push(`${item.id}: live item missing mappedLiveSlug`);
    }
    if (item.mappedLiveSlug && !liveSlugs.has(item.mappedLiveSlug)) {
      mappedRouteOk = false;
      failures.push(`${item.id}: mappedLiveSlug not found: ${item.mappedLiveSlug}`);
    }
  }

  if (failures.some((f) => f.includes("empty"))) localeOk = false;

  rows.push(["Free duplicate id", "0", ids.size === items.length ? "PASS" : "FAIL"]);
  rows.push(["Free duplicate slug", "0", slugs.size === items.length ? "PASS" : "FAIL"]);
  rows.push(["Free locale completeness", "-", localeOk ? "PASS" : "FAIL"]);
  rows.push(["Free forbidden terminology", "-", forbiddenOk ? "PASS" : "FAIL"]);
  rows.push(["Free planned mappedLiveSlug", "-", plannedLinkOk ? "PASS" : "FAIL"]);
  rows.push(["Free live mappedLiveSlug present", "-", liveSlugOk ? "PASS" : "FAIL"]);
  rows.push(["Free mapped route exists", "-", mappedRouteOk ? "PASS" : "FAIL"]);
  rows.push(["Free trafficPotential values", "-", trafficOk ? "PASS" : "FAIL"]);
  rows.push(["Free status values", "-", statusOk ? "PASS" : "FAIL"]);

  return failures;
}

function printTable(rows) {
  const headers = ["Check", "Value", "Result"];
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => String(r[i] ?? "").length)),
  );
  const line = (cols) => cols.map((c, i) => String(c).padEnd(widths[i])).join("  ");
  console.log(line(headers));
  console.log(widths.map((w) => "-".repeat(w)).join("  "));
  for (const row of rows) console.log(line(row));
}

const liveSlugs = loadLiveSlugs();
const premium = extractConstArray(
  "src/data/strategic-premium-calculators.ts",
  "STRATEGIC_PREMIUM_CALCULATORS",
);
const free = extractConstArray("src/data/free-traffic-tool-roadmap.ts", "FREE_TRAFFIC_TOOL_ROADMAP");

const rows = [];
const failures = [
  ...auditPremium(premium, liveSlugs, rows),
  ...auditFree(free, liveSlugs, rows),
];

printTable(rows);

if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log("\naudit:tool-roadmap PASS");
