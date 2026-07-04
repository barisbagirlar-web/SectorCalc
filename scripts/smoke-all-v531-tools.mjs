/**
 * scripts/smoke-all-v531-tools.mjs
 * V5.3.1 Schema Data Quality Smoke Test on active tools.
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCHEMAS_DIR = path.join(ROOT, "src/sectorcalc/schemas/v531");
const SRC = path.join(ROOT, "src");
const OUTPUT_FILE = path.join(ROOT, "_smoke-output.json");

function listGeneratedToolSlugs() {
  if (!existsSync(SCHEMAS_DIR)) return [];
  return readdirSync(SCHEMAS_DIR)
    .filter((f) => f.endsWith(".schema.json") || f.endsWith(".json"))
    .map((f) => path.basename(f).replace(/^\d+_sc_\d+_(?:premium_)?/, "").replace(/\.schema\.json$/, "").replace(/\.json$/, ""))
    .sort();
}

function listIndustrialSlugs() {
  const toolsPath = path.join(SRC, "lib/features/tools/revenue-tools-industrial-formulas.ts");
  if (!existsSync(toolsPath)) return [];
  const content = readFileSync(toolsPath, "utf-8");
  const slugMatch = content.match(/freeSlug:\s*"([^"]+)"/g);
  if (!slugMatch) return [];
  return slugMatch.map((m) => m.match(/"([^"]+)"/)[1]);
}

function runBulkValidation(slugs) {
  const scriptPath = path.join(ROOT, "_smoke-validate-temp.ts");
  const slugJson = JSON.stringify(slugs);

  const code = [
    `import { resolveApprovedToolSchema, clearSchemaCache, getSchemaCacheStats } from "@/sectorcalc/runtime/resolve-approved-tool-schema";`,
    `import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";`,
    `import { writeFileSync } from "node:fs";`,
    ``,
    `const slugs: string[] = ${slugJson};`,
    `const results: Record<string,{ok:boolean;missing?:boolean;errors:string[];cachedOk?:boolean;cacheHit?:boolean;identityOk?:boolean;contractOk?:boolean}> = {};`,
    ``,
    `// First pass: resolve and validate`,
    `for (const slug of slugs) {`,
    `  try {`,
    `    const r = resolveApprovedToolSchema(slug);`,
    `    if (!r.ok || !r.schema) {`,
    `      results[slug] = { ok: false, missing: true, errors: r.errors || ["Not found"] };`,
    `      continue;`,
    `    }`,
    `    const sv4 = r.schema;`,
    `    const v = validateSuperV4Schema(sv4);`,
    `    if (v.ok) {`,
    `      const identityOk = sv4.tool_key === slug;`,
    `      const redactionStatus = sv4.form_runtime_binding.execute_response_contract?.redaction_status;`,
    `      const contractOk = typeof redactionStatus === "string" && redactionStatus.length > 0;`,
    `      results[slug] = { ok: true, errors: [], identityOk, contractOk };`,
    `    } else {`,
    `      results[slug] = { ok: false, errors: v.errors, identityOk: false, contractOk: false };`,
    `    }`,
    `  } catch (error) {`,
    `    results[slug] = { ok: false, errors: [(error as Error).message], identityOk: false, contractOk: false };`,
    `  }`,
    `}`,
    ``,
    `// Second pass: verify cachehit`,
    `const cacheResults: Record<string,{ok:boolean;identityOk:boolean}> = {};`,
    `for (const slug of slugs) {`,
    `  const r = resolveApprovedToolSchema(slug);`,
    `  if (r.ok && r.schema) {`,
    `    const identityOk = r.schema.tool_key === slug;`,
    `    cacheResults[slug] = { ok: true, identityOk };`,
    `  } else {`,
    `    cacheResults[slug] = { ok: false, identityOk: false };`,
    `  }`,
    `}`,
    ``,
    `const stats = getSchemaCacheStats();`,
    ``,
    `for (const slug of slugs) {`,
    `  const r = results[slug];`,
    `  if (!r) continue;`,
    `  r.cachedOk = cacheResults[slug]?.ok === true;`,
    `  r.cacheHit = r.ok && cacheResults[slug]?.ok;`,
    `  r.cacheIdentityOk = cacheResults[slug]?.identityOk === true;`,
    `}`,
    `results.__cacheStats__ = { size: stats.size, keys: stats.keys };`,
    `writeFileSync("${OUTPUT_FILE.replace(/\\/g, "\\\\")}", JSON.stringify(results), "utf-8");`,
  ].join("\n");

  writeFileSync(scriptPath, code, "utf-8");
  try {
    execSync(`npx tsx "${scriptPath}"`, {
      cwd: ROOT,
      timeout: 120000,
      stdio: "pipe",
      maxBuffer: 100 * 1024 * 1024,
    });
  } catch (err) {
    console.error("temp script execution failed:", err.stderr?.toString() || err.message);
  }

  try {
    const output = readFileSync(OUTPUT_FILE, "utf-8");
    return JSON.parse(output);
  } catch {
    throw new Error("Validation script did not produce output. Check _smoke-validate-temp.ts for errors.");
  }
}

/* ── Main ───────────────────────────────────── */

console.log("\n🧪 V5.3.1 Schema Data Quality Smoke Test\n");

const genSlugs = listGeneratedToolSlugs();
const indSlugs = listIndustrialSlugs();
const allSlugs = [...new Set([...genSlugs, ...indSlugs])];

console.log(`Generated Free Tools: ${genSlugs.length}`);
console.log(`Industrial Free Tools: ${indSlugs.length}`);
console.log(`Total active slugs: ${allSlugs.length}`);

if (allSlugs.length === 0) {
  console.error("No active slugs found!");
  process.exit(1);
}

const runResults = runBulkValidation(allSlugs);

// Cleanup
try { unlinkSync(path.join(ROOT, "_smoke-validate-temp.ts")); } catch {}
try { unlinkSync(OUTPUT_FILE); } catch {}

const summary = {
  SCHEMA_VALID_REAL_EXECUTION: 0,
  SCHEMA_IDENTITY_MISMATCH_FAIL: 0,
  SCHEMA_CONTRACT_FAIL: 0,
  SCHEMA_INVALID_FAIL: 0,
};

let exitCode = 0;

for (const slug of allSlugs) {
  const r = runResults[slug];
  if (!r) {
    console.error(`❌ NO_RESULT for ${slug}`);
    exitCode = 1;
    continue;
  }
  
  if (r.ok) {
    if (!r.identityOk) {
      console.error(`❌ IDENTITY_MISMATCH for ${slug}: expected requested tool key to match schema tool_key`);
      summary.SCHEMA_IDENTITY_MISMATCH_FAIL++;
      exitCode = 1;
    } else if (!r.contractOk) {
      console.error(`❌ CONTRACT_FAIL for ${slug}: execute_response_contract.redaction_status is missing or empty`);
      summary.SCHEMA_CONTRACT_FAIL++;
      exitCode = 1;
    } else {
      summary.SCHEMA_VALID_REAL_EXECUTION++;
    }
  } else {
    console.error(`❌ INVALID_SCHEMA for ${slug}:`, r.errors);
    summary.SCHEMA_INVALID_FAIL++;
    exitCode = 1;
  }
}

console.log("\n=== SMOKE TEST SUMMARY ===");
console.log(JSON.stringify(summary, null, 2));

const cacheStats = runResults.__cacheStats__;
if (cacheStats) {
  console.log(`\nCache Size: ${cacheStats.size}`);
}

if (exitCode === 0) {
  console.log("\n✅ ALL ACTIVE SCHEMAS PASSED SMOKE TESTS!");
} else {
  console.log("\n❌ SMOKE TESTS FAILED!");
}

process.exit(exitCode);
