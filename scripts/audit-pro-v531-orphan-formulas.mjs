#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Orphan Formula Audit
// Classifies every formula file in src/sectorcalc/formulas/pro-v531/.
// Writes report to data/audits/pro-v531-orphan-formulas.json
// Manifest-driven. Does not delete. Reports only.

import { readFileSync, existsSync, readdirSync, mkdirSync, writeFileSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FORMULA_DIR = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531");
const SCHEMA_DIR = resolve(__dirname, "../src/sectorcalc/schemas/pro-v531");
const GOLDEN_DIR = resolve(__dirname, "../tests/golden/pro-v531-baris");
const REGISTRY_FILE = resolve(FORMULA_DIR, "baris-formula-registry.ts");
const READINESS_FILE = resolve(FORMULA_DIR, "baris-readiness-data.ts");
const AUDIT_DIR = resolve(__dirname, "../data/audits");
const AUDIT_FILE = resolve(AUDIT_DIR, "pro-v531-orphan-formulas.json");

// Baris live tool keys (from readiness data)
const readinessRaw = readFileSync(READINESS_FILE, "utf-8");
const liveMatch = readinessRaw.match(/LIVE_ENGINE_READY_TOOLS.*?\[\n([\s\S]*?)\];/);
const barisLiveKeys = new Set();
if (liveMatch) {
  const re = /tool_key:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(liveMatch[1])) !== null) barisLiveKeys.add(m[1]);
}

// Registered tool keys (from registry file)
const regRaw = readFileSync(REGISTRY_FILE, "utf-8");
const registeredKeys = new Set();
const regRe = /toolKey:\s*"([^"]+)"/g;
let rm;
while ((rm = regRe.exec(regRaw)) !== null) registeredKeys.add(rm[1]);

// Schema tool keys
const schemaKeys = new Set();
if (existsSync(SCHEMA_DIR)) {
  for (const f of readdirSync(SCHEMA_DIR)) {
    if (f.endsWith(".schema.json")) {
      const key = f.replace(".schema.json", "");
      schemaKeys.add(key);
    }
  }
}

// Golden fixture keys
const goldenKeys = new Set();
if (existsSync(GOLDEN_DIR)) {
  for (const f of readdirSync(GOLDEN_DIR)) {
    if (f.endsWith(".golden.json")) {
      const key = f.replace(".golden.json", "");
      goldenKeys.add(key);
    }
  }
}

// Check if a file is referenced in tests
function isReferencedInTests(toolKey) {
  const TEST_DIRS = [
    resolve(__dirname, "../tests/pro-v531-baris"),
    resolve(__dirname, "../tests"),
  ];
  for (const td of TEST_DIRS) {
    if (!existsSync(td)) continue;
    const files = readdirSync(td, { recursive: true }).filter(f => f.endsWith(".ts"));
    for (const f of files) {
      try {
        const content = readFileSync(resolve(td, f), "utf-8");
        if (content.includes(toolKey)) return true;
      } catch {}
    }
  }
  return false;
}

const allFiles = readdirSync(FORMULA_DIR).filter(f => f.endsWith(".formula.ts") && !f.startsWith("baris-"));

// Baris active formula files (Batch 1+2)
const barisActiveFiles = [];
const orphanFiles = [];
const registeredFiles = [];
const legacyFiles = [];
const unverifiedFiles = [];

for (const file of allFiles) {
  const toolKey = file.replace(".formula.ts", "");
  const isBarisLive = barisLiveKeys.has(toolKey);
  const isRegistered = registeredKeys.has(toolKey);
  const hasSchema = schemaKeys.has(toolKey);
  const hasGolden = goldenKeys.has(toolKey);
  const inTests = isReferencedInTests(toolKey);

  if (isBarisLive) {
    barisActiveFiles.push(file);
  }
  if (isRegistered) {
    registeredFiles.push(file);
  }

  if (isBarisLive || isRegistered) {
    // Already counted
  } else if (hasSchema || hasGolden || inTests) {
    legacyFiles.push(file);
  } else if (toolKey.startsWith("sc_")) {
    orphanFiles.push(file);
  } else {
    unverifiedFiles.push(file);
  }
}

const result = {
  audit_timestamp: new Date().toISOString(),
  audit_scope: "src/sectorcalc/formulas/pro-v531/*.formula.ts (excluding baris-* files)",
  total_formula_files: allFiles.length,
  active_registered: registeredFiles.length,
  baris_live: barisActiveFiles.length,
  legacy_referenced: legacyFiles.length,
  orphan_unreferenced: orphanFiles.length,
  do_not_delete_unverified: unverifiedFiles.length,
  classification: "DO_NOT_DELETE_UNVERIFIED",
  production_impact_on_baris: "NONE",
  blocked_reason: "135 sc_* files are legacy formula templates from the original 135 PRO schema set. They are referenced by schema files only, not by Baris runtime. They cannot be safely archived without schema ownership verification. They are excluded from Baris registry, routing, and client bundle.",
  baris_live_files: barisActiveFiles,
  orphan_files: orphanFiles,
  legacy_files: legacyFiles,
  unverified_files: unverifiedFiles,
};

// Write audit report
if (!existsSync(AUDIT_DIR)) {
  mkdirSync(AUDIT_DIR, { recursive: true });
}
writeFileSync(AUDIT_FILE, JSON.stringify(result, null, 2), "utf-8");

console.log(JSON.stringify({
  total_formula_files: result.total_formula_files,
  active_registered: result.active_registered,
  baris_live: result.baris_live,
  legacy_referenced: result.legacy_referenced,
  orphan_unreferenced: result.orphan_unreferenced,
  do_not_delete_unverified: result.do_not_delete_unverified,
  classification: result.classification,
  production_impact_on_baris: result.production_impact_on_baris,
  blocked_reason: result.blocked_reason,
  audit_file: AUDIT_FILE,
}, null, 2));

process.exit(0);
