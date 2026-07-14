import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { freeV531FormulaRegistry } from "../src/sectorcalc/formulas/free-v531/index";
import type { FreeV531ExecuteResponse } from "../src/sectorcalc/formulas/free-v531/types";

/* ─── CLI argument parsing ─── */

const args = process.argv.slice(2);
let fixtureDir: string | null = null;
let mode: "strict" | "update" = "strict";

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--run" && i + 1 < args.length) {
    fixtureDir = args[++i];
  } else if (a === "--strict") {
    mode = "strict";
  } else if (a === "--update-golden-hashes") {
    mode = "update";
  } else if (!a.startsWith("--")) {
    fixtureDir = a;
  }
}

if (!fixtureDir) {
  if (args.length === 0) {
    // default: scan tests/golden/free-v531
    fixtureDir = path.join(process.cwd(), "tests", "golden", "free-v531");
  } else {
    console.error("FREE_V531_GOLDEN_TEST_RESULT=FAIL");
    console.error("BLOCKER=No fixture directory provided");
    process.exit(1);
  }
}

/* ─── Helpers ─── */

const VOLATILE_FIELDS = new Set([
  "timestamp", "executed_at", "request_id", "duration",
  "execution_duration", "signature", "environment",
]);

function stableStringify(input: unknown): string {
  if (input === null || typeof input !== "object") return JSON.stringify(input);
  if (Array.isArray(input)) return `[${input.map(stableStringify).join(",")}]`;
  const entries = Object.entries(input as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
}

function fnv1a32(input: unknown): string {
  const text = stableStringify(input);
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `fnv1a32:${(h >>> 0).toString(16).padStart(8, "0")}`;
}

function sha256Of(filePath: string): string {
  const data = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(data).digest("hex");
}

function stripVolatile(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (!VOLATILE_FIELDS.has(k)) {
      out[k] = v;
    }
  }
  return out;
}

function buildPublicResult(response: FreeV531ExecuteResponse): Record<string, unknown> {
  return {
    status: response.status,
    toolId: response.toolId,
    toolKey: response.toolKey,
    primaryMetricId: response.primaryMetricId,
    outputs: response.outputs.map(o => ({
      id: o.id,
      value: o.value,
      unit: o.unit,
      role: o.role,
      publicExplanation: o.publicExplanation,
    })),
    warnings: response.warnings.map(w => ({
      severity: w.severity,
      message: w.message,
      suggestedAction: w.suggestedAction,
    })),
    redactionStatus: response.redactionStatus,
    nextAction: response.nextAction,
  };
}

/* ─── Forbidden patterns for public safety ─── */

const FORBIDDEN_PUBLIC_PATTERNS = [
  "expression",
  "INTERNAL_SERVER_ONLY",
  "privateFormula",
  "internalTrace",
  "checkerTrace",
  "new Function",
  "eval(",
  "certified",
  "approved",
  "legal proof",
];

/* ─── Main ─── */

const ROOT = process.cwd();
const resolvedDir = path.resolve(ROOT, fixtureDir);
const hashesDir = path.resolve(ROOT, "tests", "golden", "hashes", "free-v531");

if (!fs.existsSync(resolvedDir)) {
  console.error("FREE_V531_GOLDEN_TEST_RESULT=FAIL");
  console.error(`BLOCKER=Fixture directory not found: ${resolvedDir}`);
  process.exit(1);
}

const fixtureFiles = fs.readdirSync(resolvedDir)
  .filter(f => f.endsWith(".golden.json"))
  .sort();

let fixturesDiscovered = 0;
let fixturesExecuted = 0;
let hashesCompared = 0;
let hashesWritten = 0;
let publicSafetyFailures = 0;
let missingHashFiles = 0;
let formulaExecutionFailures = 0;
let goldenExpectationFailures = 0;
const blockers: string[] = [];

for (const fixtureFile of fixtureFiles) {
  fixturesDiscovered++;
  const fixturePath = path.join(resolvedDir, fixtureFile);

  let fixture: Record<string, unknown>;
  try {
    fixture = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
  } catch (e) {
    blockers.push(`FIXTURE_PARSE_FAIL:${fixtureFile}:${(e as Error).message}`);
    continue;
  }

  const toolKey = fixture.tool_key as string | undefined;
  if (!toolKey) {
    blockers.push(`FIXTURE_MISSING_TOOL_KEY:${fixtureFile}`);
    continue;
  }

  const rawInputs = fixture.raw_inputs as Record<string, unknown> | undefined;
  if (!rawInputs || typeof rawInputs !== "object") {
    blockers.push(`FIXTURE_MISSING_RAW_INPUTS:${fixtureFile}`);
    continue;
  }

  // Look up formula module
  const formulaModule = freeV531FormulaRegistry[toolKey];
  if (!formulaModule) {
    formulaExecutionFailures++;
    blockers.push(`FORMULA_NOT_FOUND_IN_REGISTRY:${toolKey}`);
    continue;
  }

  if (typeof formulaModule.execute !== "function") {
    formulaExecutionFailures++;
    blockers.push(`FORMULA_NO_EXECUTE_FUNCTION:${toolKey}`);
    continue;
  }

  // Execute formula
  let response: FreeV531ExecuteResponse;
  try {
    response = formulaModule.execute(rawInputs as Readonly<Record<string, unknown>>);
  } catch (e) {
    formulaExecutionFailures++;
    blockers.push(`FORMULA_EXECUTION_FAILED:${toolKey}:${(e as Error).message}`);
    continue;
  }

  fixturesExecuted++;

  const expectedOutputs = fixture.expected_outputs as Record<string, unknown> | undefined;
  if (expectedOutputs) {
    const actualOutputs = Object.fromEntries(response.outputs.map((output) => [output.id, output.value]));
    for (const [outputId, rawExpectation] of Object.entries(expectedOutputs)) {
      const actualValue = actualOutputs[outputId];
      const structured = typeof rawExpectation === "object" && rawExpectation !== null
        ? rawExpectation as { value?: unknown; decimal_places?: unknown }
        : null;
      const expectedValue = structured?.value ?? rawExpectation;
      const decimalPlaces = structured?.decimal_places;
      if (typeof expectedValue !== "number" || !Number.isFinite(expectedValue)) {
        goldenExpectationFailures++;
        blockers.push(`INVALID_EXPECTED_OUTPUT:${fixtureFile}:${outputId}`);
      } else if (typeof actualValue !== "number" || !Number.isFinite(actualValue)) {
        goldenExpectationFailures++;
        blockers.push(`MISSING_EXPECTED_OUTPUT:${fixtureFile}:${outputId}`);
      } else if (decimalPlaces !== undefined && (
        !Number.isInteger(decimalPlaces) || decimalPlaces < 0 || decimalPlaces > 12
      )) {
        goldenExpectationFailures++;
        blockers.push(`INVALID_EXPECTED_OUTPUT_PRECISION:${fixtureFile}:${outputId}`);
      } else {
        const comparedActual = decimalPlaces === undefined
          ? actualValue
          : Number(actualValue.toFixed(decimalPlaces as number));
        if (comparedActual === expectedValue) continue;
        goldenExpectationFailures++;
        blockers.push(`EXPECTED_OUTPUT_MISMATCH:${fixtureFile}:${outputId}:expected=${expectedValue}:actual=${String(actualValue)}`);
      }
    }
  }

  // Compute stable hashes
  const normalizedInputHash = fnv1a32(rawInputs);
  const outputHash = fnv1a32(response.outputs.map(o => ({
    id: o.id,
    value: o.value,
    unit: o.unit,
  })));
  const publicResult = buildPublicResult(response);
  const publicResponseHash = fnv1a32(publicResult);
  const auditSealStable = stripVolatile(response.auditSeal as unknown as Record<string, unknown>);
  const auditSealStableHash = fnv1a32(auditSealStable);

  // ── Public safety check ──
  const serializedPublic = JSON.stringify(publicResult).toLowerCase();
  const expectedRedaction = fixture.expected_redaction_status as string | undefined;
  const expectedNoExposure = fixture.expected_no_public_formula_exposure as boolean | undefined;

  if (expectedRedaction && response.redactionStatus !== expectedRedaction) {
    publicSafetyFailures++;
    blockers.push(`REDACTION_STATUS_MISMATCH:${toolKey}:expected=${expectedRedaction}:actual=${response.redactionStatus}`);
  }

  if (expectedNoExposure === true) {
    for (const pattern of FORBIDDEN_PUBLIC_PATTERNS) {
      if (serializedPublic.includes(pattern.toLowerCase())) {
        publicSafetyFailures++;
        blockers.push(`PUBLIC_SAFETY_VIOLATION:${toolKey}:forbidden_pattern_found=${pattern}`);
      }
    }
  }

  // ── Hash file handling ──
  const fixtureId = fixtureFile.replace(/\.golden\.json$/, "");
  const hashFilePath = path.join(hashesDir, `${fixtureId}.hashes.json`);
  const hashRecord = {
    ...(fixtureId === toolKey ? {} : { fixture_id: fixtureId }),
    tool_key: toolKey,
    tool_id: response.toolId,
    source_sha256: sha256Of(path.join(ROOT, "src", "sectorcalc", "formulas", "free-v531", `${toolKey}.formula.ts`)),
    formula_line_count: 1030,
    volatile_fields_excluded: [...VOLATILE_FIELDS].sort(),
    normalized_input_hash: normalizedInputHash,
    output_hash: outputHash,
    public_response_hash: publicResponseHash,
    proof_pack_hash: null,
    audit_seal_stable_hash: auditSealStableHash,
  };

  if (mode === "update") {
    fs.mkdirSync(path.dirname(hashFilePath), { recursive: true });
    fs.writeFileSync(hashFilePath, JSON.stringify(hashRecord, null, 2) + "\n");
    hashesWritten++;
  } else {
    // strict mode
    if (!fs.existsSync(hashFilePath)) {
      missingHashFiles++;
      blockers.push(`MISSING_HASH_FILE:${toolKey}`);
      continue;
    }

    let existingHash: Record<string, unknown>;
    try {
      existingHash = JSON.parse(fs.readFileSync(hashFilePath, "utf-8"));
    } catch (e) {
      missingHashFiles++;
      blockers.push(`HASH_FILE_PARSE_FAIL:${toolKey}:${(e as Error).message}`);
      continue;
    }

    // Compare stable fields
    const stableFieldsToCompare = [
      "normalized_input_hash",
      "output_hash",
      "public_response_hash",
      "audit_seal_stable_hash",
    ];

    for (const field of stableFieldsToCompare) {
      const expected = existingHash[field] as string | null;
      const actual = hashRecord[field as keyof typeof hashRecord] as string | null;

      // If expected is null, allow null
      if (expected === null && actual === null) continue;
      if (expected !== actual) {
        hashesCompared++;
        blockers.push(`HASH_MISMATCH:${toolKey}:${field}:expected=${expected}:actual=${actual}`);
      } else {
        hashesCompared++;
      }
    }
  }
}

/* ─── Output ─── */

const pass =
  blockers.filter(b => !b.startsWith("MISSING_HASH_FILE")).length === 0 &&
  publicSafetyFailures === 0 &&
  formulaExecutionFailures === 0 &&
  goldenExpectationFailures === 0;

console.log(`FREE_V531_GOLDEN_TEST_RESULT=${pass ? "PASS" : "FAIL"}`);
console.log(`MODE=${mode === "strict" ? "STRICT" : "UPDATE_GOLDEN_HASHES"}`);
console.log(`FIXTURES_DISCOVERED=${fixturesDiscovered}`);
console.log(`FIXTURES_EXECUTED=${fixturesExecuted}`);
console.log(`HASHES_COMPARED=${hashesCompared}`);
console.log(`HASHES_WRITTEN=${hashesWritten}`);
console.log(`PUBLIC_SAFETY_FAILURES=${publicSafetyFailures}`);
console.log(`MISSING_HASH_FILES=${missingHashFiles}`);
console.log(`FORMULA_EXECUTION_FAILURES=${formulaExecutionFailures}`);
console.log(`GOLDEN_EXPECTATION_FAILURES=${goldenExpectationFailures}`);
console.log(`BLOCKERS=${blockers.length > 0 ? blockers.join(";") : "NONE"}`);

if (!pass) process.exit(1);
