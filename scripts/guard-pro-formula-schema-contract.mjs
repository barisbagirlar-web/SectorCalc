#!/usr/bin/env node

/**
 * guard:pro-formula-schema-contract
 *
 * Static contract check between every PRO v531 schema.json and its formula.ts, run on every
 * push touching schemas/formulas (wire into CI same as the other guard:pro-* scripts) so a
 * new or edited tool cannot silently ship with the bug classes found in the 2026-07-15 audit:
 *
 *   1. ORPHAN SCHEMA INPUT — a field the schema declares and the UI collects, but the formula
 *      never reads via get(inputs, "n_..."). The user fills it in, it has zero effect on the
 *      result. (Root cause: leftover fields from a shared/cloned template.)
 *
 *   2. DOUBLE NORMALIZATION — a field with base_unit "ratio" and "percent" in
 *      allowed_display_units (meaning the server already normalizes a percent entry down to
 *      0..1 before calculate() runs) that the formula body then divides by a literal 100 a
 *      second time. Silently shrinks the value 100x.
 *
 *   3. RAW ANNUAL VOLUME — a field with base_unit "unit_per_s" and "annual" in its name, used
 *      in the formula without multiplying by SECONDS_PER_YEAR (or 31536000) anywhere in the
 *      same file. The normalized value is a per-second rate, not a yearly count; using it
 *      directly is off by a ~31.5 million factor.
 *
 * This is intentionally a fast, regex-based static check, not a full AST validator — it does
 * NOT catch wrong business logic (e.g. markup vs. margin, a fabricated constant standing in
 * for a real input). Those require domain judgment and were fixed case-by-case in the audit;
 * this guard only prevents the mechanical, provably-wrong classes above from recurring.
 *
 * Exit behavior:
 *   - Any ORPHAN SCHEMA INPUT or DOUBLE NORMALIZATION or RAW ANNUAL VOLUME hit on a tool in
 *     LIVE_TOOL_KEYS => FAIL (exit 1). These are load-bearing, user-facing tools.
 *   - Same findings on a tool NOT in LIVE_TOOL_KEYS => WARN only (exit 0), since draft/WIP
 *     tools are expected to have incomplete wiring during development.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMA_DIR = join(ROOT, "src", "sectorcalc", "schemas", "pro-v531");
const FORMULA_DIR = join(ROOT, "src", "sectorcalc", "formulas", "pro-v531");

// Keep this in sync with guard-pro-display-units.mjs's LIVE_TOOL_KEYS.
const LIVE_TOOL_KEYS = [
  "break-even-survival-cash-calculator",
  "machine-hourly-rate-proof-report",
  "loss-making-job-detector",
  "receivables-cost-payment-term-addendum",
  "setup-time-reduction-roi-smed",
  "product-sku-margin-ranker",
  "true-employee-cost-statement",
  "job-quote-builder-pro-pack",
  "machine-investment-feasibility-buy-lease-keep",
  "capital-equipment-investment-appraisal-npv-irr",
  "customer-sku-profitability-forensics",
  "downtime-scrap-loss-statement",
  "oee-loss-monetization-improvement-business-case",
  "scrap-rework-cost-tracker",
  "outsource-vs-in-house-analyzer",
  "plant-wide-shop-rate-cost-structure-audit",
  "fx-commodity-pass-through-pricer",
  "energy-efficiency-grant-incentive-feasibility-pack",
  "motor-compressor-replacement-roi",
  "weld-procedure-cost-consumable-estimation-suite",
];

// Known, reviewed exceptions: fields intentionally captured by the schema but not used by the
// formula because wiring them in requires a business-semantics decision, not a mechanical fix.
// Each entry must have a one-line reason -- this list is a deliberate, reviewed allowlist, not
// a way to silence the guard. Add to it only with the same rigor as the audit that built it.
const REVIEWED_ORPHAN_EXCEPTIONS = {
  "customer-sku-profitability-forensics": {
    n_labor_rate: "2026-07-15 audit: unit_variable_cost already carries fully-loaded per-unit cost; folding a $/h rate in needs a per-unit service-time basis this schema doesn't collect. Needs Baris's input before wiring.",
    n_overhead_rate: "2026-07-15 audit: same reason as n_labor_rate above.",
  },
};

let liveFailures = 0;
let draftWarnings = 0;

const schemaFiles = readdirSync(SCHEMA_DIR).filter((f) => f.endsWith(".schema.json"));

for (const schemaFile of schemaFiles) {
  let schema;
  try {
    schema = JSON.parse(readFileSync(join(SCHEMA_DIR, schemaFile), "utf8"));
  } catch {
    continue;
  }
  const toolKey = schema.tool_key;
  if (!toolKey || !Array.isArray(schema.inputs)) continue;

  const formulaPath = join(FORMULA_DIR, `${toolKey}.formula.ts`);
  if (!existsSync(formulaPath)) continue; // schema-only / not yet implemented, not this guard's concern

  const formulaSrc = readFileSync(formulaPath, "utf8");
  const isLive = LIVE_TOOL_KEYS.includes(toolKey);
  const exceptions = REVIEWED_ORPHAN_EXCEPTIONS[toolKey] || {};

  const findings = [];

  // Recognize both the `get(inputs, "n_x")` helper pattern and the destructured
  // `parsed.values.n_x` pattern (break-even-survival-cash-calculator style) as "read".
  const readViaGet = new Set(
    [...formulaSrc.matchAll(/get\(inputs,\s*"(n_[\w]+)"\)/g)].map((m) => m[1])
  );
  const readViaRequiredKeys = new Set(
    [...formulaSrc.matchAll(/^\s*"(n_[\w]+)",?\s*$/gm)].map((m) => m[1])
  );
  const usedVars = new Set([...readViaGet, ...readViaRequiredKeys]);

  // 1. Orphan schema input
  for (const input of schema.inputs) {
    const nid = input.normalized_id;
    if (!nid) continue;
    if (usedVars.has(nid)) continue;
    if (exceptions[nid]) continue; // reviewed, documented exception
    findings.push(`ORPHAN SCHEMA INPUT: "${input.id}" (${nid}) declared but never read by calculate().`);
  }

  // 2. Double normalization: ratio+percent field whose local alias is divided by 100
  for (const input of schema.inputs) {
    const nid = input.normalized_id;
    if (!nid) continue;
    if (input.base_unit !== "ratio") continue;
    if (!(input.allowed_display_units || []).includes("percent")) continue;
    const aliasMatch = formulaSrc.match(
      new RegExp(`const\\s+(\\w+)\\s*=\\s*get\\(inputs,\\s*"${nid}"\\)`)
    );
    if (!aliasMatch) continue;
    const alias = aliasMatch[1];
    if (new RegExp(`\\b${alias}\\s*/\\s*100\\b`).test(formulaSrc)) {
      findings.push(
        `DOUBLE NORMALIZATION: "${input.id}" (${nid}) is base_unit "ratio" with a "percent" display option (already normalized to 0..1 server-side), but the formula divides it by 100 again.`
      );
    }
  }

  // 3. Raw annual volume: unit_per_s field with "annual" in the name, used without a
  //    SECONDS_PER_YEAR / 31536000 conversion anywhere in the file.
  const hasYearConversion = /31536000|SECONDS_PER_YEAR/.test(formulaSrc);
  for (const input of schema.inputs) {
    const nid = input.normalized_id;
    if (!nid) continue;
    if (input.base_unit !== "unit_per_s") continue;
    if (!/annual/i.test(input.name || "")) continue;
    const aliasMatch = formulaSrc.match(
      new RegExp(`const\\s+(\\w+)\\s*=\\s*get\\(inputs,\\s*"${nid}"\\)`)
    );
    if (!aliasMatch) continue; // not read at all -> already caught by orphan check above
    if (!hasYearConversion) {
      findings.push(
        `RAW ANNUAL VOLUME: "${input.id}" (${nid}) is base_unit "unit_per_s" (a rate) but the formula has no 31536000/SECONDS_PER_YEAR conversion anywhere -- it is almost certainly being used as if it were a raw yearly count.`
      );
    }
  }

    // 4. "_pct"-named field that does NOT offer "percent" as a selectable unit (so the
  //    normalizer passes the raw entered number through unchanged, whatever scale the user
  //    typed it in) but whose formula alias is divided by 100 anyway -- found in 5 tools
  //    during the 2026-07-15 audit (motor-compressor x2, downtime-scrap x1, fx-commodity x3,
  //    scrap-rework x1). The fix each time was to add "percent" as a real option AND remove
  //    the formula's redundant /100 -- do the same for any new hit here.
  for (const input of schema.inputs) {
    const nid = input.normalized_id;
    if (!nid) continue;
    const looksLikePercent =
      /pct|percent/i.test(input.id || "") || /percent/i.test(input.name || "");
    if (!looksLikePercent) continue;
    if ((input.allowed_display_units || []).includes("percent")) continue; // fine, real option exists
    const aliasMatch = formulaSrc.match(
      new RegExp(`const\\\\s+(\\\\w+)\\\\s*=\\\\s*get\\\\(inputs,\\\\s*"${nid}"\\\\)`)
    );
    const inlineDivide = new RegExp(
      `get\\\\(inputs,\\\\s*"${nid}"\\\\)\\\\s*/\\\\s*100`
    ).test(formulaSrc);
    const aliasDivide =
      aliasMatch && new RegExp(`\\\\b${aliasMatch[1]}\\\\s*/\\\\s*100\\\\b`).test(formulaSrc);
    if (inlineDivide || aliasDivide) {
      findings.push(
        `PERCENT NAME WITHOUT PERCENT UNIT: "${input.id}" (${nid}) is named like a percent field but "percent" is not in allowed_display_units, so users can only enter a raw ratio -- yet the formula divides it by 100 as if a 0..100 percent had been entered.`
      );
    }
  }

  if (findings.length === 0) continue;

  const label = isLive ? "FAIL" : "WARN (draft/non-live tool)";
  console.error(`\n[${label}] ${toolKey}`);
  for (const f of findings) console.error(`  - ${f}`);

  if (isLive) liveFailures += findings.length;
  else draftWarnings += findings.length;
}

if (liveFailures > 0) {
  console.error(
    `\n[GUARD FAIL] ${liveFailures} formula-schema contract violation(s) on LIVE PRO tools. ` +
      `If a finding is a deliberate, reviewed exception (needs business input, not a mechanical fix), ` +
      `add it to REVIEWED_ORPHAN_EXCEPTIONS in this script with a dated reason -- do not silently ignore it.`
  );
  process.exit(1);
}

if (draftWarnings > 0) {
  console.warn(`\n[GUARD WARN] ${draftWarnings} finding(s) on non-live/draft PRO tools (not blocking).`);
}

console.log(
  `[PASS] guard:pro-formula-schema-contract — ${schemaFiles.length} PRO schemas checked, ${LIVE_TOOL_KEYS.length} live tools verified clean.`
);
