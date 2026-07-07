#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Orphan Formula Audit
// Classifies every formula file in src/sectorcalc/formulas/pro-v531/.
// Manifest-driven. Does not delete. Reports only.

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FORMULA_DIR = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531");
const SCHEMA_DIR = resolve(__dirname, "../src/sectorcalc/schemas/pro-v531");
const GOLDEN_DIR = resolve(__dirname, "../tests/golden/pro-v531-baris");
const REGISTRY_FILE = resolve(FORMULA_DIR, "baris-formula-registry.ts");
const READINESS_FILE = resolve(FORMULA_DIR, "baris-readiness-data.ts");

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

const result = {
  total_formula_files: allFiles.length,
  active_registered: 0,
  baris_live: 0,
  legacy_referenced: 0,
  orphan_unreferenced: 0,
  do_not_delete_unverified: 0,
  orphan_files: [],
  baris_live_files: [],
  registered_files: [],
  unverified_files: [],
};

for (const file of allFiles) {
  const toolKey = file.replace(".formula.ts", "");
  const filePath = resolve(FORMULA_DIR, file);
  
  const isBarisLive = barisLiveKeys.has(toolKey);
  const isRegistered = registeredKeys.has(toolKey);
  const hasSchema = schemaKeys.has(toolKey);
  const hasGolden = goldenKeys.has(toolKey);
  const inTests = isReferencedInTests(toolKey);

  if (isBarisLive) {
    result.baris_live++;
    result.baris_live_files.push(file);
  }
  if (isRegistered) {
    result.active_registered++;
    result.registered_files.push(file);
  }

  if (isBarisLive || isRegistered) {
    // Already counted
  } else if (hasSchema || hasGolden || inTests) {
    result.legacy_referenced++;
  } else if (toolKey.startsWith("sc_")) {
    // Unknown sc_* file - orphan unless verified
    result.orphan_unreferenced++;
    result.orphan_files.push(file);
  } else {
    result.do_not_delete_unverified++;
    result.unverified_files.push(file);
  }
}

// Output
console.log(JSON.stringify({
  ...result,
  baris_live_keys: [...barisLiveKeys],
  schema_keys_count: schemaKeys.size,
  golden_keys_count: goldenKeys.size,
  registered_keys_count: registeredKeys.size,
}, null, 2));

process.exit(0);
