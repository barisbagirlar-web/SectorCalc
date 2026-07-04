/**
 * scripts/smoke-all-v531-tools.mjs
 *
 * V5.3.1 Schema Data Quality Smoke Test.
 *
 * SCOPE (202 schemas total):
 *   1. PRO V5.3.1 schemas — loaded via pro-schema-loader, validated against SuperV4Schema (135)
 *   2. Industrial Free Tool schemas — built from revenue-tools-industrial-formulas (16)
 *   3. Free V5.3.1 schemas — loaded via free-schema-loader, validated against SuperV4Schema (51)
 *
 * Resolve priority note:
 *   resolveApprovedToolSchema prioritizes generated_free over pro_v531.
 *   To test PRO schemas specifically, this script uses getProToolSchema directly.
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const OUTPUT_FILE = path.join(ROOT, "_smoke-output.json");

function listProToolSchemaSlugs() {
  const loaderPath = path.join(SRC, "sectorcalc/runtime/pro-schema-loader.ts");
  if (!existsSync(loaderPath)) return [];

  // Use tsx to call listProToolSchemaSlugs() via a temp script
  const code = `
import { listProToolSchemaSlugs } from "@/sectorcalc/runtime/pro-schema-loader";
import { writeFileSync } from "fs";
writeFileSync("${OUTPUT_FILE.replace(/\\/g, "\\\\")}", JSON.stringify(listProToolSchemaSlugs()), "utf8");
`;
  const scriptPath = path.join(ROOT, "_smoke-list-pro-temp.mjs");
  writeFileSync(scriptPath, code, "utf8");
  try {
    execSync(`npx tsx "${scriptPath}"`, { cwd: ROOT, timeout: 30000, stdio: "pipe" });
    const result = JSON.parse(readFileSync(OUTPUT_FILE, "utf8"));
    return Array.isArray(result) ? result.sort() : [];
  } catch {
    return [];
  } finally {
    try { unlinkSync(scriptPath); } catch {}
    try { unlinkSync(OUTPUT_FILE); } catch {}
  }
}

function listFreeV531ToolSlugs() {
  const loaderPath = path.join(SRC, "sectorcalc/runtime/free-schema-loader.ts");
  if (!existsSync(loaderPath)) return [];

  const code = `
import { listFreeToolSchemaSlugs } from "@/sectorcalc/runtime/free-schema-loader";
import { writeFileSync } from "fs";
writeFileSync("${OUTPUT_FILE.replace(/\\/g, "\\\\")}", JSON.stringify(listFreeToolSchemaSlugs()), "utf8");
`;
  const scriptPath = path.join(ROOT, "_smoke-list-free-temp.mjs");
  writeFileSync(scriptPath, code, "utf8");
  try {
    execSync(`npx tsx "${scriptPath}"`, { cwd: ROOT, timeout: 30000, stdio: "pipe" });
    const result = JSON.parse(readFileSync(OUTPUT_FILE, "utf8"));
    return Array.isArray(result) ? result.sort() : [];
  } catch {
    return [];
  } finally {
    try { unlinkSync(scriptPath); } catch {}
    try { unlinkSync(OUTPUT_FILE); } catch {}
  }
}

function listIndustrialSlugs() {
  const toolsPath = path.join(SRC, "lib/features/tools/revenue-tools-industrial-formulas.ts");
  if (!existsSync(toolsPath)) return [];
  const content = readFileSync(toolsPath, "utf-8");
  const slugMatch = content.match(/freeSlug:\s*"([^"]+)"/g);
  if (!slugMatch) return [];
  return slugMatch.map((m) => m.match(/"([^"]+)"/)[1]).sort();
}

function runBulkValidation(slugs, category) {
  const scriptPath = path.join(ROOT, "_smoke-validate-temp.ts");
  const slugJson = JSON.stringify(slugs);
  const categoryUpper = JSON.stringify(category);

  const code = [
    `import { resolveApprovedToolSchema, clearSchemaCache, getSchemaCacheStats } from "@/sectorcalc/runtime/resolve-approved-tool-schema";`,
    `import { getProToolSchema } from "@/sectorcalc/runtime/pro-schema-loader";`,
    `import { getFreeToolSchema } from "@/sectorcalc/runtime/free-schema-loader";`,
    `import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";`,
    `import { writeFileSync } from "node:fs";`,
    ``,
    `const slugs: string[] = ${slugJson};`,
    `const category: string = ${categoryUpper};`,
    `const results: Record<string,{ok:boolean;source:string;missing?:boolean;errors:string[];identityOk?:boolean;contractOk?:boolean}> = {};`,
    ``,
    `for (const slug of slugs) {`,
    `  try {`,
    `    let schema = null;`,
    `    let source = "";`,
    ``,
    `    if (category === "pro_v531") {`,
    `      schema = getProToolSchema(slug);`,
    `      source = "pro_v531";`,
    `    } else if (category === "free_v531") {`,
    `      schema = getFreeToolSchema(slug);`,
    `      source = "free_v531";`,
    `    } else {`,
    `      const r = resolveApprovedToolSchema(slug);`,
    `      if (r.ok && r.schema) {`,
    `        schema = r.schema;`,
    `        source = r.source;`,
    `      }`,
    `    }`,
    ``,
    `    if (!schema) {`,
    `      results[slug] = { ok: false, source: category, missing: true, errors: ["Schema not found"] };`,
    `      continue;`,
    `    }`,
    ``,
    `    // Free V5.3.1 uses lighter PRO validation (validateProV531Schema)`,
    `    let valid = false;`,
    `    let errors: string[] = [];`,
    `    let identityOk = false;`,
    `    let contractOk = false;`,
    ``,
    `    if (category === "free_v531") {`,
    `      const hasToolKey = typeof schema.tool_key === "string" && schema.tool_key.length > 0;`,
    `      const hasToolName = typeof schema.tool_name === "string" && schema.tool_name.length > 0;`,
    `      const hasInputs = Array.isArray(schema.inputs) && schema.inputs.length > 0;`,
    `      const hasOutputs = Array.isArray(schema.outputs) && schema.outputs.length > 0;`,
    `      identityOk = schema.tool_key === slug;`,
    `      contractOk = typeof schema.form_runtime_binding?.execute_response_contract?.redaction_status === "string";`,
    `      valid = hasToolKey && hasToolName && hasInputs && hasOutputs;`,
    `      if (!valid) {`,
    `        if (!hasToolKey) errors.push("Missing tool_key");`,
    `        if (!hasToolName) errors.push("Missing tool_name");`,
    `        if (!hasInputs) errors.push("No inputs");`,
    `        if (!hasOutputs) errors.push("No outputs");`,
    `      }`,
    `    } else {`,
    `      const v = validateSuperV4Schema(schema);`,
    `      if (v.ok) {`,
    `        identityOk = schema.tool_key === slug;`,
    `        const redactionStatus = schema.form_runtime_binding?.execute_response_contract?.redaction_status;`,
    `        contractOk = typeof redactionStatus === "string" && redactionStatus.length > 0;`,
    `        valid = true;`,
    `      } else {`,
    `        errors = v.errors;`,
    `      }`,
    `    }`,
    ``,
    `    if (valid) {`,
    `      results[slug] = { ok: true, source, errors: [], identityOk, contractOk };`,
    `    } else {`,
    `      results[slug] = { ok: false, source, errors, identityOk, contractOk: false };`,
    `    }`,
    `  } catch (error) {`,
    `    results[slug] = { ok: false, source: category, errors: [(error as Error).message], identityOk: false, contractOk: false };`,
    `  }`,
    `}`,
    `results.__cacheStats__ = { size: getSchemaCacheStats().size };`,
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
    throw new Error("Validation script did not produce output.");
  }
}

function printSummary(label, slugs, results) {
  let valid = 0;
  let identityFail = 0;
  let contractFail = 0;
  let invalid = 0;
  let missing = 0;

  for (const slug of slugs) {
    const r = results[slug];
    if (!r) { missing++; continue; }
    if (r.ok) {
      if (!r.identityOk) identityFail++;
      else if (!r.contractOk) contractFail++;
      else valid++;
    } else {
      invalid++;
    }
  }

  console.log(`\n${label}: ${slugs.length} tools`);
  console.log(`  Valid: ${valid}, Identity mismatch: ${identityFail}, Contract fail: ${contractFail}, Invalid: ${invalid}, Missing: ${missing}`);

  return { valid, identityFail, contractFail, invalid, missing };
}

/* ── Main ── */

console.log("\n🧪 V5.3.1 Schema Data Quality Smoke Test\n");
console.log("SCOPE: PRO V5.3.1 (135) + Free V5.3.1 (51) + Industrial Free (16) = 202 schemas\n");

// 1. PRO V5.3.1 schemas
const proSlugs = listProToolSchemaSlugs();
console.log(`PRO V5.3.1 slugs: ${proSlugs.length}`);
const proResults = runBulkValidation(proSlugs, "pro_v531");
const proSummary = printSummary("PRO V5.3.1", proSlugs, proResults);

// 2. Free V5.3.1 schemas
const freeV531Slugs = listFreeV531ToolSlugs();
console.log(`\nFree V5.3.1 slugs: ${freeV531Slugs.length}`);
const freeV531Results = runBulkValidation(freeV531Slugs, "free_v531");
const freeV531Summary = printSummary("Free V5.3.1", freeV531Slugs, freeV531Results);

// 3. Industrial Free slugs
const indSlugs = listIndustrialSlugs();
console.log(`\nIndustrial Free slugs: ${indSlugs.length}`);
const indResults = runBulkValidation(indSlugs, "industrial_free");
const indSummary = printSummary("Industrial Free", indSlugs, indResults);

// 4. Combined summary
const totalTested = proSlugs.length + freeV531Slugs.length + indSlugs.length;
const totalValid = proSummary.valid + freeV531Summary.valid + indSummary.valid;
const totalIdentityFail = proSummary.identityFail + freeV531Summary.identityFail + indSummary.identityFail;
const totalContractFail = proSummary.contractFail + freeV531Summary.contractFail + indSummary.contractFail;
const totalInvalid = proSummary.invalid + freeV531Summary.invalid + indSummary.invalid;
const totalMissing = proSummary.missing + freeV531Summary.missing + indSummary.missing;

console.log("\n═══════════════════════════════════");
console.log("  COMBINED SMOKE TEST SUMMARY");
console.log("═══════════════════════════════════");
console.log(JSON.stringify({
  scope: "V5.3.1 PRO + Free + Industrial Free",
  pro_count: proSlugs.length,
  free_v531_count: freeV531Slugs.length,
  industrial_free_count: indSlugs.length,
  total_tested: totalTested,
  valid: totalValid,
  identity_mismatch: totalIdentityFail,
  contract_fail: totalContractFail,
  invalid: totalInvalid,
  missing: totalMissing,
}, null, 2));

let exitCode = 0;
if (totalIdentityFail > 0) {
  console.error("\n❌ IDENTITY MISMATCH failures found");
  exitCode = 1;
}
if (totalContractFail > 0) {
  console.error("❌ CONTRACT failures found");
  exitCode = 1;
}
if (totalInvalid > 0) {
  console.error("❌ INVALID schemas found");
  exitCode = 1;
}
if (totalMissing > 0) {
  console.error("❌ MISSING schemas found");
  exitCode = 1;
}

// Cleanup temp files
try { unlinkSync(path.join(ROOT, "_smoke-validate-temp.ts")); } catch {}
try { unlinkSync(OUTPUT_FILE); } catch {}

if (exitCode === 0) {
  console.log(`\n✅ ALL ${totalTested} SCHEMAS PASSED SMOKE TESTS!`);
  process.exit(0);
} else {
  console.log(`\n❌ SMOKE TESTS FAILED!`);
  process.exit(1);
}
