#!/usr/bin/env npx tsx
import fs from "node:fs";
import path from "node:path";
import { runtimeValidateCalculator } from "../src/lib/generated-tools/runtime-validate-calculator";
import {
  evaluateSchemaTrust,
  type TrustGateResult,
  type TrustGateStatus,
} from "../src/lib/generated-tools/trust-gate";

const SCHEMAS_DIR = path.join(process.cwd(), "generated/schemas");
const OUTPUT_FILE = path.join(process.cwd(), "p24-audit-report.json");

type AuditResult = TrustGateResult & {
  readonly category: string;
  readonly sector: string;
  readonly hasFormulas: boolean;
  readonly hasOutputs: boolean;
  readonly hasValidInputs: boolean;
  readonly hasUndefinedFunctions: boolean;
  readonly runtimeStatus: "PASS" | "FAIL" | "SKIPPED";
  readonly runtimeError: string;
};

function resolveAuditStatus(
  staticStatus: TrustGateStatus,
  runtimeStatus: "PASS" | "FAIL" | "SKIPPED",
  runtimeError: string,
  issues: string[],
): TrustGateStatus {
  if (staticStatus === "QUARANTINE") {
    return "QUARANTINE";
  }

  if (runtimeStatus === "FAIL") {
    if (runtimeError) {
      issues.push(`Runtime: ${runtimeError}`);
    }
    return "RUNTIME_FAIL";
  }

  if (staticStatus === "WARN" || issues.length > 0) {
    return "WARN";
  }

  return "PASS";
}

const RUNTIME_CONCURRENCY = 24;

async function mapWithConcurrency<T, R>(
  items: readonly T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function runWorker(): Promise<void> {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker());
  await Promise.all(workers);
  return results;
}

async function auditSchemaFile(file: string): Promise<AuditResult> {
  const filePath = path.join(SCHEMAS_DIR, file);
  const schema = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
  const slug =
    typeof schema.toolName === "string" && schema.toolName.trim()
      ? schema.toolName.trim()
      : file.replace("-schema.json", "");

  const trust = evaluateSchemaTrust(schema, slug);
  const formulas =
    schema.formulas && typeof schema.formulas === "object"
      ? (schema.formulas as Record<string, unknown>)
      : {};
  const formulaStr = JSON.stringify(formulas);
  const issues = [...trust.issues];

  let runtimeStatus: "PASS" | "FAIL" | "SKIPPED" = "SKIPPED";
  let runtimeError = "";

  if (trust.status === "PASS" || trust.status === "WARN") {
    const runtimeResult = await runtimeValidateCalculator(slug, { schema });
    runtimeStatus = runtimeResult.status;
    runtimeError = runtimeResult.error ?? "";
  }

  const status = resolveAuditStatus(trust.status, runtimeStatus, runtimeError, issues);
  const icon =
    status === "PASS" ? "✅" : status === "WARN" ? "⚠️" : status === "RUNTIME_FAIL" ? "🚫" : "❌";
  console.log(`${icon} ${slug}: ${status} (${issues.length} issues)`);

  return {
    slug,
    status,
    reason: issues[0] ?? trust.reason,
    issues,
    fixable: trust.fixable,
    category: typeof schema.category === "string" ? schema.category : "Diğer",
    sector: typeof schema.sector === "string" ? schema.sector : "Diğer",
    hasFormulas: Object.keys(formulas).length > 0,
    hasOutputs: Boolean(
      schema.outputs &&
        typeof schema.outputs === "object" &&
        typeof (schema.outputs as Record<string, unknown>).primary === "string",
    ),
    hasValidInputs: Array.isArray(schema.inputs) && schema.inputs.length > 0,
    hasUndefinedFunctions:
      formulaStr.includes("f(") ||
      formulaStr.includes("g(") ||
      formulaStr.includes("calc(") ||
      formulaStr.includes("calculate("),
    runtimeStatus,
    runtimeError,
  };
}

async function main(): Promise<void> {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    console.error(`❌ Schemas directory not found: ${SCHEMAS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(SCHEMAS_DIR).filter((file) => file.endsWith("-schema.json"));
  const results = await mapWithConcurrency(files, RUNTIME_CONCURRENCY, auditSchemaFile);

  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(results, null, 2)}\n`);

  const pass = results.filter((result) => result.status === "PASS").length;
  const warn = results.filter((result) => result.status === "WARN").length;
  const fail = results.filter((result) => result.status === "FAIL").length;
  const runtimeFail = results.filter((result) => result.status === "RUNTIME_FAIL").length;
  const quarantine = results.filter((result) => result.status === "QUARANTINE").length;

  console.log(`\n📊 Audit tamamlandı: ${results.length} şema`);
  console.log(`   ✅ PASS: ${pass}`);
  console.log(`   ⚠️ WARN: ${warn}`);
  console.log(`   ❌ FAIL: ${fail}`);
  console.log(`   🚫 RUNTIME_FAIL: ${runtimeFail}`);
  console.log(`   📦 QUARANTINE: ${quarantine}`);
  console.log(`   output: ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
