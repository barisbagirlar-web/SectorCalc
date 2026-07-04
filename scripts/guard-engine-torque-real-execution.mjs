// Guard: Assert Engine Torque Calculator has real execution chain
// Fails if:
// - imports preview/shell/normalized preview renderer
// - no reference value fields
// - no tolerance fields
// - no result population path

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = join(fileURLToPath(import.meta.url), "..");
const ROOT = join(__dirname, "..");

function checkSchema() {
  const schemaPath = join(ROOT, "src/sectorcalc/schemas/free-v531/engine-torque-calculator.schema.json");
  if (!existsSync(schemaPath)) {
    console.error("FAIL: Schema not found in free-v531");
    return false;
  }

  let schema;
  try {
    schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  } catch {
    console.error("FAIL: Schema is invalid JSON");
    return false;
  }

  let ok = true;
  const inputIds = (schema.inputs || []).map((i) => i.id);

  if (!inputIds.includes("enginePowerKw")) { console.error("FAIL: Missing enginePowerKw"); ok = false; }
  if (!inputIds.includes("engineSpeedRpm")) { console.error("FAIL: Missing engineSpeedRpm"); ok = false; }
  if (!inputIds.includes("referencePowerKw")) { console.error("FAIL: Missing referencePowerKw"); ok = false; }
  if (!inputIds.includes("referenceSpeedRpm")) { console.error("FAIL: Missing referenceSpeedRpm"); ok = false; }
  if (!inputIds.includes("powerTolerancePct")) { console.error("FAIL: Missing powerTolerancePct"); ok = false; }
  if (!inputIds.includes("speedTolerancePct")) { console.error("FAIL: Missing speedTolerancePct"); ok = false; }
  if (!inputIds.includes("userVerified")) { console.error("FAIL: Missing userVerified"); ok = false; }
  if (!inputIds.includes("sourceVerified")) { console.error("FAIL: Missing sourceVerified"); ok = false; }

  const outputIds = (schema.outputs || []).map((o) => o.id);
  if (!outputIds.includes("engine_torque")) { console.error("FAIL: Missing output engine_torque"); ok = false; }

  const frb = schema.form_runtime_binding;
  if (!frb || frb.renderer !== "UniversalIndustrialDecisionForm") { console.error("FAIL: renderer must be UniversalIndustrialDecisionForm"); ok = false; }
  if (frb.client_formula_execution !== "FORBIDDEN") { console.error("FAIL: client_formula_execution must be FORBIDDEN"); ok = false; }
  if (frb.server_execution_required !== true) { console.error("FAIL: server_execution_required must be true"); ok = false; }

  console.log("  free-v531 schema: OK");
  return ok;
}

function checkFormula() {
  const formulaPath = join(ROOT, "src/sectorcalc/formulas/free-v531/engine-torque-calculator.formula.ts");
  if (!existsSync(formulaPath)) {
    console.error("FAIL: formula module not found");
    return false;
  }
  const content = readFileSync(formulaPath, "utf8");
  if (!content.includes("export function calculate")) { console.error("FAIL: formula must export calculate"); return false; }
  if (!content.includes("export const toolKey")) { console.error("FAIL: formula must export toolKey"); return false; }

  console.log("  formula module: OK");
  return true;
}

function checkP24Verdict() {
  const verdictPath = join(ROOT, "src/lib/features/tools/runtime-readiness-p24-verdicts.ts");
  const content = readFileSync(verdictPath, "utf8");
  if (content.includes('"engine-torque-calculator": "QUARANTINE"')) { console.error("FAIL: still QUARANTINE"); return false; }
  if (content.includes('"engine-torque-calculator": "FAIL"')) { console.error("FAIL: verdict is FAIL"); return false; }
  if (content.includes('"engine-torque-calculator": "WARN"')) { console.error("FAIL: verdict is WARN"); return false; }

  const passMatch = content.match(/"engine-torque-calculator":\s*"(PASS)"/);
  if (!passMatch) { console.error("FAIL: verdict not set to PASS"); return false; }

  console.log("  P2.4 verdict: OK");
  return true;
}

function checkExecutionPriority() {
  const execPath = join(ROOT, "src/app/api/pro-calculator/execute/route.ts");
  const content = readFileSync(execPath, "utf8");

  const pass1Start = content.indexOf("// PASS 1");
  if (pass1Start < 0) { console.error("FAIL: PASS 1 section not found"); return false; }

  const afterPass1 = content.slice(pass1Start);
  const freeIdx = afterPass1.indexOf("isFreeV531ToolSlug");
  const genIdx = afterPass1.indexOf("getGeneratedToolSchema");

  if (freeIdx < 0) { console.error("FAIL: isFreeV531ToolSlug not in PASS 1"); return false; }
  if (freeIdx > genIdx) { console.error("FAIL: free_v531 must be before generated in PASS 1"); return false; }

  console.log("  execution API priority: OK");
  return true;
}

function checkNoPreviewFallback() {
  const routePath = join(ROOT, "src/app/tools/generated/[slug]/page.tsx");
  const content = readFileSync(routePath, "utf8");

  if (content.includes("NormalizedPreview")) { console.error("FAIL: route uses NormalizedPreview"); return false; }
  if (!content.includes("UniversalIndustrialDecisionForm")) { console.error("FAIL: route does not use UniversalIndustrialDecisionForm"); return false; }

  console.log("  no preview fallback: OK");
  return true;
}

console.log("Guard: Engine Torque Real Execution\n");

const results = [
  ["Schema", checkSchema()],
  ["Formula module", checkFormula()],
  ["P2.4 verdict", checkP24Verdict()],
  ["Execution API priority", checkExecutionPriority()],
  ["No preview fallback", checkNoPreviewFallback()],
];

console.log("");
const allPass = results.every(([, r]) => r);
if (allPass) {
  console.log("GUARD PASS: Engine Torque Calculator has real execution chain.");
  process.exit(0);
} else {
  console.error("GUARD FAIL: One or more checks failed.");
  process.exit(1);
}
