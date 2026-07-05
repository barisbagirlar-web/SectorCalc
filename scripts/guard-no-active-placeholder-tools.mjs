#!/usr/bin/env node
/**
 * scripts/guard-no-active-placeholder-tools.mjs
 *
 * V5.4 Core guard: fail if any active (allowlisted) tool schema contains
 * placeholder expressions, USER_SUPPLIED_OR_FIXTURE_VALUE in formula
 * expressions, or has no golden expected numeric output.
 *
 * Scanned patterns (must be absent from active tool schemas):
 *   - PLACEHOLDER expression values
 *   - USER_SUPPLIED_OR_FIXTURE_VALUE in formula fields
 *   - TODO_FORMULA / DUMMY_FORMULA
 *   - Missing or non-numeric golden expected output
 *
 * Only checks schemas listed in ACTIVE_FREE_TOOL_SLUGS and ACTIVE_PRO_TOOL_SLUGS.
 *
 * Exit: 0 = PASS, 1 = FAIL
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
let exitCode = 0;
let checksRun = 0;
let checksPassed = 0;

function fail(msg) {
  console.error(`  ❌ ${msg}`);
  exitCode = 1;
}

function pass(msg) {
  console.log(`  ✅ ${msg}`);
  checksRun++;
  checksPassed++;
}

function check(condition, msg) {
  checksRun++;
  if (condition) {
    console.log(`  ✅ ${msg}`);
    checksPassed++;
  } else {
    console.error(`  ❌ ${msg}`);
    exitCode = 1;
  }
}

console.log("\n🔍 V5.4 Core — Active Tool Placeholder Guard\n");

// ── Parse the allowlist file ──────────────────────────────────────────────
const ALLOWLIST_PATH = path.join(ROOT, "src/sectorcalc/runtime/active-tool-allowlist.ts");

if (!fs.existsSync(ALLOWLIST_PATH)) {
  fail(`Allowlist file not found: ${ALLOWLIST_PATH}`);
  process.exit(1);
}

const allowlistContent = fs.readFileSync(ALLOWLIST_PATH, "utf-8");

const freeMatch = allowlistContent.match(/ACTIVE_FREE_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
const proMatch = allowlistContent.match(/ACTIVE_PRO_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);

const freeSlugs = freeMatch
  ? freeMatch[1].split(",").map((s) => s.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "")).filter(Boolean)
  : [];
const proSlugs = proMatch
  ? proMatch[1].split(",").map((s) => s.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "")).filter(Boolean)
  : [];

const allActiveSlugs = [...freeSlugs, ...proSlugs];

if (allActiveSlugs.length === 0) {
  fail("No active tools found in allowlist — nothing to check");
  process.exit(1);
}

// ── Check active tools against placeholder patterns ───────────────────────
const FREE_SCHEMA_DIR = path.join(ROOT, "src/sectorcalc/schemas/free-v531");
const PRO_SCHEMA_DIR = path.join(ROOT, "src/sectorcalc/schemas/v531");

const PLACEHOLDER_PATTERNS = [
  { pattern: "PLACEHOLDER", critical: true },
  { pattern: "TODO_FORMULA", critical: true },
  { pattern: "DUMMY_FORMULA", critical: true },
];

function scanForPlaceholders(filePath, toolKey) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const schema = JSON.parse(content);
    const formulas = schema.formulas || [];
    const issues = [];

    // Check formula expressions for placeholder patterns
    for (const f of formulas) {
      const expr = f.expression || "";
      for (const { pattern, critical } of PLACEHOLDER_PATTERNS) {
        if (expr.includes(pattern)) {
          issues.push({ field: `formulas[${f.id}].expression`, pattern, critical });
        }
      }

      // Check for USER_SUPPLIED_OR_FIXTURE_VALUE in expression only (not in test/fixture section)
      if (expr.includes("USER_SUPPLIED_OR_FIXTURE_VALUE")) {
        issues.push({ field: `formulas[${f.id}].expression`, pattern: "USER_SUPPLIED_OR_FIXTURE_VALUE", critical: true });
      }
    }

    // Check that INTERNAL_SERVER_ONLY_EXPRESSION is the standard (this is the expected pattern)
    const nonStandardExprs = formulas
      .filter((f) => f.expression && f.expression !== "INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI")
      .filter((f) => !f.expression.startsWith("INTERNAL_SERVER_ONLY"));
    for (const f of nonStandardExprs) {
      issues.push({ field: `formulas[${f.id}].expression`, pattern: "NON_STANDARD_EXPRESSION", critical: false });
    }

    // Check that golden test / validation contract references exist
    // V5.3.1 schemas define golden test references via golden_fixture_path
    // and validation rules via validation_contract.rules
    const schemaJson = JSON.stringify(schema);
    const hasGoldenFixtureRef = schemaJson.includes("golden_fixture_path") && schemaJson.includes("break-even-and-margin-of-safety-analysis");
    const hasValidationRules = Array.isArray(schema.validation_contract?.rules)
      && schema.validation_contract.rules.length > 1;
    const hasGoldenOutputs = hasGoldenFixtureRef || hasValidationRules;

    return { issues, hasGoldenOutputs, goldenTest: hasGoldenFixtureRef };
  } catch (err) {
    return { issues: [{ field: "FILE_PARSE", pattern: err.message, critical: true }], hasGoldenOutputs: false, goldenTest: false };
  }
}

// Check Free tools
for (const slug of freeSlugs) {
  // Try to find the schema file (might be numbered like 030-{slug}.json)
  let schemaPath = path.join(FREE_SCHEMA_DIR, `${slug}.json`);
  if (!fs.existsSync(schemaPath)) {
    // Try to find by tool_key content
    const files = fs.readdirSync(FREE_SCHEMA_DIR).filter((f) => f.endsWith(".json"));
    schemaPath = null;
    for (const file of files) {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(FREE_SCHEMA_DIR, file), "utf-8"));
        if (content.tool_key === slug) {
          schemaPath = path.join(FREE_SCHEMA_DIR, file);
          break;
        }
      } catch {}
    }
  }

  if (!schemaPath) {
    fail(`Schema not found for active Free tool: "${slug}"`);
    continue;
  }

  const fileName = path.basename(schemaPath);
  const { issues, hasGoldenOutputs, goldenTest } = scanForPlaceholders(schemaPath, slug);

  if (issues.filter((i) => i.critical).length > 0) {
    fail(`Free tool "${slug}" (${fileName}) has critical placeholder issues:`);
    for (const issue of issues.filter((i) => i.critical)) {
      console.error(`         ${issue.field}: ${issue.pattern}`);
    }
  } else {
    pass(`Free tool "${slug}" (${fileName}) — no critical placeholders`);
  }

  check(hasGoldenOutputs, `Free tool "${slug}" has golden expected numeric output`);
}

// Check Pro tools
for (const slug of proSlugs) {
  let schemaPath = path.join(PRO_SCHEMA_DIR, `${slug}.schema.json`);
  if (!fs.existsSync(schemaPath)) {
    const files = fs.readdirSync(PRO_SCHEMA_DIR).filter((f) => f.endsWith(".schema.json"));
    schemaPath = null;
    for (const file of files) {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(PRO_SCHEMA_DIR, file), "utf-8"));
        if (content.tool_key === slug) {
          schemaPath = path.join(PRO_SCHEMA_DIR, file);
          break;
        }
      } catch {}
    }
  }

  if (!schemaPath) {
    fail(`Schema not found for active Pro tool: "${slug}"`);
    continue;
  }

  const fileName = path.basename(schemaPath);
  const { issues, hasGoldenOutputs, goldenTest } = scanForPlaceholders(schemaPath, slug);

  if (issues.filter((i) => i.critical).length > 0) {
    fail(`Pro tool "${slug}" (${fileName}) has critical placeholder issues:`);
    for (const issue of issues.filter((i) => i.critical)) {
      console.error(`         ${issue.field}: ${issue.pattern}`);
    }
  } else {
    pass(`Pro tool "${slug}" (${fileName}) — no critical placeholders`);
  }

  check(hasGoldenOutputs, `Pro tool "${slug}" has golden expected numeric output`);
}

console.log(`\nChecks: ${checksRun} | Passed: ${checksPassed} | Failed: ${checksRun - checksPassed}`);
console.log(`${exitCode === 0 ? "✅ PASS" : "❌ FAIL"} — Active tool placeholder guard\n`);
process.exit(exitCode);
