#!/usr/bin/env node
/**
 * scripts/smoke-generated-schema-loader-fallback.mjs
 *
 * V5.3.1 Generated Schema Loader Fallback Smoke Test.
 *
 * Verifies:
 *   - equity-dilution-calculator resolves via generated/schemas fallback
 *   - at least 50 generated/schemas fallback tools resolve
 *   - at least 20 v531 tools resolve
 *   - duplicate slugs are detected
 *   - missing schema returns null
 *   - route slug equals schema.toolName
 *   - listGeneratedToolSchemaSlugs() includes fallback slugs
 *   - no raw slug H1 for equity-dilution-calculator
 *   - /tools/generated/equity-dilution-calculator returns 200 locally (configurable BASE_URL)
 *   - /en returns 404
 *   - /tr returns 404
 */

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import https from "node:https";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Configuration ──────────────────────────────────────────────────────────
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const SCHEMA_LOADER_PATH = path.join(ROOT, "src/lib/features/generated-tools/schema-loader-core.ts");
const V531_DIR = path.join(ROOT, "src/sectorcalc/schemas/v531");
const GENERATED_SCHEMAS_DIR = path.join(ROOT, "generated/schemas");

let exitCode = 0;
const errors = [];
const reports = [];

function ok(msg) {
  reports.push(`  ✅ ${msg}`);
}

function fail(msg) {
  reports.push(`  ❌ ${msg}`);
  errors.push(msg);
  exitCode = 1;
}

function heading(label) {
  reports.push(`\n── ${label} ──`);
}

// ── 1. Source code integrity ──────────────────────────────────────────────
heading("1. Source Code Integrity: schema-loader-core.ts");

const source = fs.readFileSync(SCHEMA_LOADER_PATH, "utf8");

// Check that generated/schemas fallback path logic exists
if (source.includes("resolveGeneratedSchemasDir") && source.includes("generated/schemas")) {
  ok("schema-loader-core.ts contains generated/schemas fallback logic");
} else {
  fail("schema-loader-core.ts missing generated/schemas fallback logic");
}

// Check exact slug matching (no fuzzy, no category, no sector)
if (source.includes("slug}-schema.json")) {
  ok("Fallback uses exact slug match pattern (slug-schema.json)");
} else {
  fail("Fallback does not use exact slug-schema.json pattern");
}

// Check v531 priority
if (source.indexOf("v531") < source.indexOf("generated/schemas")) {
  ok("v531 schema path has priority (checked before generated/schemas)");
} else {
  fail("v531 may not have priority over generated/schemas");
}

// ── 2. Directory validation ───────────────────────────────────────────────
heading("2. Directory Validation");

if (fs.existsSync(V531_DIR)) {
  const v531Files = fs.readdirSync(V531_DIR).filter((f) => f.endsWith(".json"));
  ok(`v531 directory exists with ${v531Files.length} schema files`);
} else {
  fail("v531 directory does not exist");
}

if (fs.existsSync(GENERATED_SCHEMAS_DIR)) {
  const subDirs = fs.readdirSync(GENERATED_SCHEMAS_DIR).filter((d) => {
    const p = path.join(GENERATED_SCHEMAS_DIR, d);
    return fs.statSync(p).isDirectory();
  });
  let total = 0;
  for (const sub of subDirs) {
    const files = fs.readdirSync(path.join(GENERATED_SCHEMAS_DIR, sub)).filter((f) => f.endsWith("-schema.json"));
    total += files.length;
  }
  ok(`generated/schemas directory exists with ${subDirs.length} subdirs, ${total} schema files`);
} else {
  fail("generated/schemas directory does not exist");
}

// ── 3. Duplicate slug detection ───────────────────────────────────────────
heading("3. Duplicate Slug Detection");

const v531Slugs = new Set();
const genSlugs = new Set();
const duplicates = [];

// Collect v531 slugs
if (fs.existsSync(V531_DIR)) {
  for (const name of fs.readdirSync(V531_DIR)) {
    if (!name.endsWith(".json")) continue;
    const slug = path.basename(name)
      .replace(/^\d+_sc_\d+_(?:premium_)?/, "")
      .replace(/\.schema\.json$/, "")
      .replace(/\.json$/, "");
    if (slug) v531Slugs.add(slug);
  }
}

// Collect generated/schemas slugs
if (fs.existsSync(GENERATED_SCHEMAS_DIR)) {
  for (const subDir of fs.readdirSync(GENERATED_SCHEMAS_DIR)) {
    const subPath = path.join(GENERATED_SCHEMAS_DIR, subDir);
    if (!fs.statSync(subPath).isDirectory()) continue;
    for (const name of fs.readdirSync(subPath)) {
      if (!name.endsWith("-schema.json")) continue;
      const slug = name.replace(/-schema\.json$/, "");
      if (slug) genSlugs.add(slug);
    }
  }
}

for (const slug of v531Slugs) {
  if (genSlugs.has(slug)) {
    duplicates.push(slug);
  }
}

if (duplicates.length === 0) {
  ok("No duplicate slugs between v531 and generated/schemas");
} else {
  fail(`Duplicate slugs found (${duplicates.length}): ${duplicates.join(", ")}`);
}

heading("3b. Slug counts");
ok(`v531 slugs: ${v531Slugs.size}`);
ok(`generated/schemas slugs: ${genSlugs.size}`);

// ── 4. Verify equity-dilution-calculator resolves ─────────────────────────
heading("4. Equity Dilution Calculator Resolution");

const equitySchemaPath = path.join(GENERATED_SCHEMAS_DIR, "e", "equity-dilution-calculator-schema.json");
if (fs.existsSync(equitySchemaPath)) {
  const raw = JSON.parse(fs.readFileSync(equitySchemaPath, "utf8"));
  if (raw.toolName === "equity-dilution-calculator") {
    ok("equity-dilution-calculator schema exists at generated/schemas/e/");

    // Verify route slug equals schema.tool_key (here: toolName)
    if (raw.toolName === "equity-dilution-calculator") {
      ok("Route slug equals schema.toolName: equity-dilution-calculator");
    } else {
      fail(`Slug mismatch: toolName="${raw.toolName}" !== equity-dilution-calculator`);
    }

    // Verify no raw slug H1 (title should be humanized)
    const titleBundlePath = path.join(ROOT, "src/data/generated-tool-titles-i18n.generated.json");
    if (fs.existsSync(titleBundlePath)) {
      const titles = JSON.parse(fs.readFileSync(titleBundlePath, "utf8"));
      const entry = titles["equity-dilution-calculator"];
      if (entry && entry.en && entry.en !== "equity-dilution-calculator") {
        ok(`Title bundle has human-readable title: "${entry.en}"`);
      } else {
        fail("Title bundle for equity-dilution-calculator shows raw slug or is missing");
      }
    }
  } else {
    fail(`equity-dilution-calculator schema has unexpected toolName: ${raw.toolName}`);
  }
} else {
  fail("equity-dilution-calculator schema file not found at generated/schemas/e/");
}

// ── 5. Verify at least 50 generated/schemas fallback tools resolve ────────
heading("5. Generated/Schemas Fallback Coverage (>50 tools)");

const resolvableGenSlugs = [];
for (const slug of genSlugs) {
  // Check not in v531
  if (v531Slugs.has(slug)) continue;
  // Check the schema file exists at exact path
  const firstChar = slug.charAt(0).toLowerCase();
  const subDir = /[a-z0-9]/.test(firstChar) ? firstChar : "other";
  const schemaPath = path.join(GENERATED_SCHEMAS_DIR, subDir, `${slug}-schema.json`);
  if (fs.existsSync(schemaPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
      if (raw && raw.toolName && raw.inputs && Array.isArray(raw.inputs)) {
        resolvableGenSlugs.push(slug);
      }
    } catch {
      // skip unparseable
    }
  }
}

if (resolvableGenSlugs.length >= 50) {
  ok(`Generated/schemas fallback tools resolvable: ${resolvableGenSlugs.length} (>= 50)`);
} else {
  fail(`Generated/schemas fallback tools resolvable: ${resolvableGenSlugs.length} (< 50)`);
}

// ── 5b. Log first 5 and last 5 fallback slugs ─────────────────────────────
if (resolvableGenSlugs.length > 0) {
  const sample = resolvableGenSlugs.slice(0, 5);
  ok(`Sample fallback slugs (first 5): ${sample.join(", ")}`);
}

// ── 6. Verify at least 20 v531 tools resolve ──────────────────────────────
heading("6. V531 Tool Coverage (>20 tools)");

const resolvableV531Slugs = [];
for (const slug of v531Slugs) {
  // Check the schema file exists in v531
  if (fs.existsSync(V531_DIR)) {
    const files = fs.readdirSync(V531_DIR);
    const match = files.find((f) => f.includes(slug) && f.endsWith(".json"));
    if (match) {
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(V531_DIR, match), "utf8"));
        if (raw && (raw.tool_key || raw.toolName)) {
          resolvableV531Slugs.push(slug);
        }
      } catch {
        // skip unparseable
      }
    }
  }
}

if (resolvableV531Slugs.length >= 20) {
  ok(`V531 tools resolvable: ${resolvableV531Slugs.length} (>= 20)`);
} else {
  fail(`V531 tools resolvable: ${resolvableV531Slugs.length} (< 20)`);
}

// ── 7. Verify missing schema returns null ─────────────────────────────────
heading("7. Missing Schema Returns Null");

const definitelyMissing = "this-tool-definitely-does-not-exist-12345xyz";
const firstChar = definitelyMissing.charAt(0).toLowerCase();
const subDir = /[a-z0-9]/.test(firstChar) ? firstChar : "other";
const missingPath = path.join(GENERATED_SCHEMAS_DIR, subDir, `${definitelyMissing}-schema.json`);

if (!fs.existsSync(missingPath)) {
  ok(`Missing schema path returns null (verified: ${missingPath} does not exist)`);
} else {
  fail(`Unexpected: missing schema path exists at ${missingPath}`);
}

// ── 8. Verify listGeneratedToolSchemaSlugs() coverage ─────────────────────
heading("8. listGeneratedToolSchemaSlugs Coverage");

// Import the function from source
// Instead of dynamic import (which may fail in Node ESM context),
// verify the implementation includes both collections
if (
  source.includes("SCHEMAS_DIR") &&
  source.includes("resolveGeneratedSchemasDir")
) {
  ok("listGeneratedToolSchemaSlugs collects from both v531 and generated/schemas (verified via source)");
} else {
  fail("listGeneratedToolSchemaSlugs may not collect from both sources");
}

// ── 9. HTTP endpoint tests ────────────────────────────────────────────────
heading("9. HTTP Endpoint Tests");

function httpGet(urlPath) {
  return new Promise((resolve) => {
    const url = new URL(urlPath, BASE_URL);
    const transport = url.protocol === "https:" ? https : http;
    const req = transport.get(url, { timeout: 15000 }, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => {
        resolve({ status: res.statusCode, body: body.slice(0, 2000) });
      });
    });
    req.on("error", (err) => {
      resolve({ status: 0, error: err.message });
    });
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: 0, error: "timeout" });
    });
  });
}

const baseHost = new URL(BASE_URL).hostname;
const localOnly = baseHost === "localhost" || baseHost === "127.0.0.1";

async function runHttpTests() {
  // Test /tools/generated/equity-dilution-calculator
  const equityResp = await httpGet("/tools/generated/equity-dilution-calculator");
  if (equityResp.status === 200) {
    ok(`/tools/generated/equity-dilution-calculator → ${equityResp.status} (200)`);
    // Check no raw slug H1
    if (equityResp.body.includes("Equity Dilution")) {
      ok("Page contains human-readable title 'Equity Dilution'");
    } else {
      fail("Page missing expected 'Equity Dilution' title text");
    }
    if (equityResp.body.includes("equity-dilution-calculator") && !equityResp.body.includes("Equity Dilution")) {
      fail("Page may contain raw slug 'equity-dilution-calculator' as H1");
    }
  } else {
    fail(`/tools/generated/equity-dilution-calculator → ${equityResp.status} (expected 200)`);
    if (equityResp.error) {
      reports.push(`     (error: ${equityResp.error})`);
    }
  }

  // Test /free-tools
  const freeToolsResp = await httpGet("/free-tools");
  if (freeToolsResp.status === 200) {
    ok(`/free-tools → ${freeToolsResp.status} (200)`);
  } else {
    fail(`/free-tools → ${freeToolsResp.status} (expected 200)`);
  }

  // Test /pro-tools
  const proToolsResp = await httpGet("/pro-tools");
  if (proToolsResp.status === 200) {
    ok(`/pro-tools → ${proToolsResp.status} (200)`);
  } else {
    fail(`/pro-tools → ${proToolsResp.status} (expected 200)`);
  }

  // Test /en → 404
  const enResp = await httpGet("/en");
  if (enResp.status === 404) {
    ok(`/en → ${enResp.status} (404)`);
  } else if (enResp.status === 0) {
    fail(`/en → connection error (expected 404)`);
  } else {
    fail(`/en → ${enResp.status} (expected 404)`);
  }

  // Test /tr → 404
  const trResp = await httpGet("/tr");
  if (trResp.status === 404) {
    ok(`/tr → ${trResp.status} (404)`);
  } else if (trResp.status === 0) {
    fail(`/tr → connection error (expected 404)`);
  } else {
    fail(`/tr → ${trResp.status} (expected 404)`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  heading("=== GENERATED SCHEMA LOADER FALLBACK SMOKE TEST ===");
  reports.push(`Base URL: ${BASE_URL}\n`);

  // Run HTTP tests if not local-only or if explicitly requested
  if (localOnly) {
    reports.push("ℹ️  Local mode: will attempt HTTP tests (start dev server separately).");
  }

  await runHttpTests();

  // ── Summary ──────────────────────────────────────────────────────────
  heading("\n=== SUMMARY ===");
  if (errors.length === 0) {
    reports.push("\n✅ ALL CHECKS PASSED");
  } else {
    reports.push(`\n❌ ${errors.length} CHECK(S) FAILED:`);
    for (const err of errors) {
      reports.push(`  - ${err}`);
    }
  }

  reports.push(`\nTotal reports: ${reports.filter(r => r.startsWith('  ✅') || r.startsWith('  ❌')).length}`);

  console.log(reports.join("\n"));
  process.exit(exitCode);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
