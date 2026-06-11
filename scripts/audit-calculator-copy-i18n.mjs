#!/usr/bin/env node
/**
 * CI gate: calculator copy i18n integrity + banned analyzer terminology in visible keys.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["tr", "de", "fr", "es", "ar"];
const CATALOG = JSON.parse(
  readFileSync(join(ROOT, "src/lib/tools/free-traffic-catalog.generated.json"), "utf8"),
);
const SLUGS = CATALOG.map((t) => t.slug);

const BANNED_VISIBLE = [
  /\bAnalyzer\b/i,
  /\bAnalysis\b/i,
  /\bAnalyze\b/i,
  /\bAnaliz\b/i,
  /\banalizi\b/i,
  /\bAnalyse\b/i,
  /\bAnalyseur\b/i,
  /\bAnalizador\b/i,
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

const SKIP_PATH_PREFIXES = ["nav.getPro", "nav.unlockPro", "osGate", "auditEngine"];

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

const failures = [];

for (const locale of LOCALES) {
  const messages = loadMessages(locale);
  const content = messages.freeToolContent ?? {};

  for (const slug of SLUGS) {
    const entry = content[slug];
    if (!entry?.title || !entry?.description) {
      failures.push(`${locale}: missing freeToolContent.${slug}.title/description`);
      continue;
    }
    if (locale === "tr") {
      for (const leak of EN_CARD_LEAKS) {
        if (entry.title.includes(leak) || entry.description.includes(leak)) {
          failures.push(`${locale}: English card leak ${slug} → "${leak}"`);
        }
      }
    }
  }

  for (const [path, value] of flatten(messages)) {
    if (!path.startsWith("freeToolUi") && !path.startsWith("premiumSchemaPage") && !path.startsWith("premiumDecisionReport") && !path.startsWith("contentAuthority")) {
      continue;
    }
    if (SKIP_PATH_PREFIXES.some((p) => path.startsWith(p))) {
      continue;
    }
    for (const banned of BANNED_VISIBLE) {
      if (banned.test(value)) {
        failures.push(`${locale}: banned term in ${path} → "${value.slice(0, 80)}"`);
        break;
      }
    }
  }
}

console.log("audit:calculator-copy");
console.log(`catalog slugs: ${SLUGS.length}`);
if (failures.length === 0) {
  console.log("PASS — no blocking issues");
  process.exit(0);
}

console.log(`FAIL — ${failures.length} issue(s):`);
for (const line of failures.slice(0, 40)) {
  console.log(`  - ${line}`);
}
if (failures.length > 40) {
  console.log(`  - … +${failures.length - 40} more`);
}
process.exit(1);
