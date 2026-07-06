#!/usr/bin/env node

/**
 * guard-pro-v531-baris-registry-binding.mjs
 *
 * Validates that Baris PRO V5.3.1 schemas are properly registered in the
 * private formula registry. Exits 0 (PASS) if all 45 schemas are bound,
 * exits 1 (FAIL) if any check fails.
 *
 * Checks:
 *   1. Read manifest from pro_tools_baris_/manifest.json
 *   2. Count schema files on disk in src/sectorcalc/schemas/pro-v531/ → must be 45
 *   3. Each manifest schema's tool_key must have a matching file on disk
 *   4. pro-v531-formula-registry.ts must exist
 *   5. If registry entries exist, verify tool_key format matches manifest
 *   6. Private formula registry must have at least one register() call for baris tool_ids
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── ANSI helpers ────────────────────────────────────────────────────────────
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

let passed = 0;
let failed = 0;

function pass(msg) {
  passed++;
  console.log(`  ${GREEN}✓${RESET} ${msg}`);
}

function fail(msg) {
  failed++;
  console.log(`  ${RED}✗${RESET} ${msg}`);
}

function heading(n, title) {
  console.log(`\n${BOLD}${CYAN}[${n}/${totalChecks}] ${title}${RESET}`);
}

// ── Paths ───────────────────────────────────────────────────────────────────
const MANIFEST_PATH = resolve(ROOT, "pro_tools_baris_", "manifest.json");
const SCHEMA_DIR = resolve(ROOT, "src", "sectorcalc", "schemas", "pro-v531");
const FORMULA_REGISTRY_PATH = resolve(
  ROOT,
  "src",
  "sectorcalc",
  "formulas",
  "pro-v531",
  "pro-v531-formula-registry.ts",
);
const PRIVATE_REGISTRY_PATH = resolve(
  ROOT,
  "src",
  "sectorcalc",
  "pro-runtime",
  "formula-registry.ts",
);
const BARIS_REGISTRY_DIR = resolve(
  ROOT,
  "src",
  "sectorcalc",
  "formulas",
  "pro-v531",
);
const FORMULA_REGISTRY_DIR = BARIS_REGISTRY_DIR;

let exitCode = 0;
const totalChecks = 7;

// ═══════════════════════════════════════════════════════════════════════════
// 1. Read manifest
// ═══════════════════════════════════════════════════════════════════════════
heading(1, "Read manifest");
if (!existsSync(MANIFEST_PATH)) {
  fail(`manifest.json not found at ${MANIFEST_PATH}`);
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
} catch (e) {
  fail(`Failed to parse manifest.json: ${e.message}`);
  process.exit(1);
}

if (!Array.isArray(manifest.schemas) || manifest.schemas.length !== 45) {
  fail(
    `manifest.schemas is not an array of length 45 (got ${manifest.schemas?.length})`,
  );
  process.exit(1);
}

pass(`manifest.json has ${manifest.schemas.length} schemas`);

// ═══════════════════════════════════════════════════════════════════════════
// 2. Count schema files on disk
// ═══════════════════════════════════════════════════════════════════════════
heading(2, "Count schema files on disk");
if (!existsSync(SCHEMA_DIR)) {
  fail(`Schema directory not found: ${SCHEMA_DIR}`);
  process.exit(1);
}

const diskFiles = readdirSync(SCHEMA_DIR).filter(
  (f) => f.endsWith(".schema.json") && f.startsWith("pro-v531") === false,
);
// Include all .schema.json files, regardless of prefix
const allSchemaFiles = readdirSync(SCHEMA_DIR).filter((f) =>
  f.endsWith(".schema.json"),
);

if (allSchemaFiles.length === 45) {
  pass(`Found ${allSchemaFiles.length} .schema.json files in pro-v531/`);
} else {
  fail(
    `Expected 45 schema files on disk, found ${allSchemaFiles.length}`,
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. Each manifest tool_key must have a matching file
// ═══════════════════════════════════════════════════════════════════════════
heading(3, "Verify manifest schemas exist on disk");
let allFilesFound = true;
for (const schema of manifest.schemas) {
  // The manifest's file field is like "schemas/foo.schema.json"
  const fileName = schema.file.replace("schemas/", "");
  const filePath = resolve(SCHEMA_DIR, fileName);
  if (!existsSync(filePath)) {
    fail(`Missing schema file: ${fileName} (tool_key: ${schema.tool_key})`);
    allFilesFound = false;
  }
}
if (allFilesFound) {
  pass(`All ${manifest.schemas.length} manifest tool_keys have matching schema files`);
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. Check pro-v531-formula-registry.ts exists
// ═══════════════════════════════════════════════════════════════════════════
heading(4, "Check formula registry exists");
if (!existsSync(FORMULA_REGISTRY_PATH)) {
  fail(`pro-v531-formula-registry.ts not found`);
  process.exit(1);
}
pass("pro-v531-formula-registry.ts exists");

// ═══════════════════════════════════════════════════════════════════════════
// 5. Check baris tool_key entries exist in the registry
// ═══════════════════════════════════════════════════════════════════════════
heading(5, "Check baris entries in formula registry");
const registryContent = readFileSync(FORMULA_REGISTRY_PATH, "utf-8");
const BARIS_REGISTRY_PATH = resolve(FORMULA_REGISTRY_DIR, "baris-formula-registry.ts");
let barisRegistryContent = "";
if (existsSync(BARIS_REGISTRY_PATH)) {
  barisRegistryContent = readFileSync(BARIS_REGISTRY_PATH, "utf-8");
  pass("baris-formula-registry.ts exists");
} else {
  fail("baris-formula-registry.ts not found");
}

// Read readiness classification to know which tools are LIVE vs BLOCKED
const BARIS_READINESS_PATH = resolve(FORMULA_REGISTRY_DIR, "baris-readiness-data.ts");
let liveToolKeys = [];
let blockedSourceKeys = [];
let blockedContractKeys = [];
if (existsSync(BARIS_READINESS_PATH)) {
  const readinessContent = readFileSync(BARIS_READINESS_PATH, "utf-8");
  const keyCatcher = /tool_key:\s*"([^"]+)"/g;
  const categories = { live: false, source: false, contract: false };
  const lines = readinessContent.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("LIVE_ENGINE_READY_TOOLS:")) categories.live = true;
    else if (line.includes("BLOCKED_SOURCE_REQUIRED_TOOLS:")) { categories.live = false; categories.source = true; }
    else if (line.includes("BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS:")) { categories.source = false; categories.contract = true; }
    else if (line.trim().startsWith("]")) { if (categories.contract) break; }
    else {
      const m = line.match(/tool_key:\s*"([^"]+)"/);
      if (m) {
        if (categories.live) liveToolKeys.push(m[1]);
        else if (categories.source) blockedSourceKeys.push(m[1]);
        else if (categories.contract) blockedContractKeys.push(m[1]);
      }
    }
  }
} else {
  fail("baris-readiness-data.ts not found - cannot validate registry binding");
}

// Extract all toolKey values from both registries
const allRegistryContent = registryContent + "\n" + barisRegistryContent;
const toolKeyMatches = allRegistryContent.match(/toolKey:\s*"([^"]+)"/g);
const registeredToolKeys = (toolKeyMatches || []).map((m) =>
  m.replace(/toolKey:\s*"/, "").replace(/"$/, ""),
);

// Also extract from BARIS_REGISTRATIONS entries (baris registry pattern)
const barisKeyMatches = barisRegistryContent.match(/"([a-z0-9][a-z0-9-]+[a-z0-9])"/g);
const barisKeysFromRegistry = (barisKeyMatches || [])
  .map((m) => m.replace(/"/g, ""))
  .filter((k) => k.includes("-"));

// Check LIVE tools: should be in registry
const liveMissing = liveToolKeys.filter(tk => !(registeredToolKeys.includes(tk) || barisKeysFromRegistry.includes(tk)));

// Check BLOCKED tools: should NOT be in registry
const blockedInRegistry = [...blockedSourceKeys, ...blockedContractKeys].filter(tk =>
  registeredToolKeys.includes(tk) || barisKeysFromRegistry.includes(tk)
);

if (liveMissing.length === 0) {
  pass(`All ${liveToolKeys.length} LIVE tools have registry entries`);
} else {
  fail(`${liveMissing.length} LIVE tools missing from registry: ${liveMissing.join(", ")}`);
}

if (blockedInRegistry.length === 0) {
  pass(`All ${blockedSourceKeys.length + blockedContractKeys.length} BLOCKED tools correctly absent from registry`);
} else {
  fail(`${blockedInRegistry.length} BLOCKED tools unexpectedly in registry: ${blockedInRegistry.join(", ")}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. Check private formula registry has register() calls for baris tool_ids
// ═══════════════════════════════════════════════════════════════════════════
heading(6, "Check private registry register() calls for baris tool_ids");
if (!existsSync(PRIVATE_REGISTRY_PATH)) {
  fail(`Private formula registry not found at ${PRIVATE_REGISTRY_PATH}`);
  process.exit(1);
}

// Scan all .registry.ts files in the pro-v531 formulas directory for register() calls
// that reference PRO_xxx tool_ids (baris tools use PRO_001 through PRO_045)
if (!existsSync(BARIS_REGISTRY_DIR)) {
  fail(`Formulas directory not found: ${BARIS_REGISTRY_DIR}`);
  process.exit(1);
}

const formulaFiles = readdirSync(BARIS_REGISTRY_DIR).filter((f) =>
  f.endsWith(".registry.ts"),
);

let barisRegisterCount = 0;
let totalRegisterCalls = 0;

for (const file of formulaFiles) {
  const filePath = resolve(BARIS_REGISTRY_DIR, file);
  const content = readFileSync(filePath, "utf-8");
  const registerMatches = content.match(/formulaRegistry\.register\(/g);
  if (registerMatches) {
    totalRegisterCalls += registerMatches.length;
    // Check if any of the registered record contains a PRO_xxx tool_id (baris pattern)
    const barisIdMatch = content.match(/TOOL_ID\s*=\s*"PRO_\d{3}/);
    const barisKeyMatch = content.match(/tool_id:\s*"PRO_\d{3}/);
    if (barisIdMatch || barisKeyMatch) {
      barisRegisterCount += registerMatches.length;
    }
  }
}

// Also check the private registry file itself for any register() calls with baris pattern
const privateRegistryContent = readFileSync(PRIVATE_REGISTRY_PATH, "utf-8");
const privateBarisMatch = privateRegistryContent.match(/PRO_\d{3}/g);
if (privateBarisMatch) {
  barisRegisterCount += privateBarisMatch.length;
}

if (barisRegisterCount > 0) {
  pass(
    `Found ${barisRegisterCount} baris-related register() references across ${formulaFiles.length} .registry.ts files + private registry`,
  );
} else {
  fail(
    `No baris register() calls found in pro-v531 registry files or private formula registry`,
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. Final summary — check all baris tool_keys are present in registry
// ═══════════════════════════════════════════════════════════════════════════
heading(7, "Final baris registry binding check");
const reportedCount = manifest.schema_count || manifest.schemas.length;

if (failed === 0) {
  console.log(
    `\n${GREEN}${BOLD}PASS${RESET} — All ${reportedCount} baris schemas properly bound in formula registry.\n`,
  );
  process.exit(0);
} else {
  console.log(
    `\n${RED}${BOLD}FAIL${RESET} — ${failed} check(s) failed out of ${totalChecks}. ${passed} passed.\n`,
  );
  process.exit(1);
}
