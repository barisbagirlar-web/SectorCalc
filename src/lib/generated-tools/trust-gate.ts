import fs from "node:fs";
import path from "node:path";
import { validateIndustrialSchema } from "@/lib/generated-tools/validate-industrial-schema";

export type TrustGateStatus = "PASS" | "WARN" | "FAIL" | "RUNTIME_FAIL" | "QUARANTINE";

export type TrustGateResult = {
  readonly slug: string;
  readonly status: TrustGateStatus;
  readonly reason?: string;
  readonly issues: readonly string[];
  readonly fixable: boolean;
};

const FORBIDDEN_FUNCTION_MARKERS = ["f(", "g(", "calc(", "calculate("] as const;

const DEFAULT_CATEGORY = "Üretim & İmalat";
const SCHEMAS_DIR = path.join(process.cwd(), "generated/schemas");

function readSlug(schema: Record<string, unknown>, fileName: string): string {
  const toolName = schema.toolName;
  if (typeof toolName === "string" && toolName.trim()) {
    return toolName.trim();
  }
  return fileName.replace(/-schema\.json$/, "");
}

function hasForbiddenFunctions(formulas: Record<string, unknown> | undefined): boolean {
  if (!formulas) {
    return false;
  }
  const formulaStr = JSON.stringify(formulas);
  return FORBIDDEN_FUNCTION_MARKERS.some((marker) => formulaStr.includes(marker));
}

export function evaluateSchemaTrust(
  schema: Record<string, unknown>,
  slug: string,
): TrustGateResult {
  const issues: string[] = [];
  const formulas =
    schema.formulas && typeof schema.formulas === "object"
      ? (schema.formulas as Record<string, unknown>)
      : undefined;
  const outputs =
    schema.outputs && typeof schema.outputs === "object"
      ? (schema.outputs as Record<string, unknown>)
      : undefined;
  const inputs = Array.isArray(schema.inputs) ? schema.inputs : [];

  const hasFormulas = Boolean(formulas && Object.keys(formulas).length > 0);
  const hasOutputs = typeof outputs?.primary === "string" && outputs.primary.length > 0;
  const hasValidInputs = inputs.length > 0;
  const category = typeof schema.category === "string" ? schema.category : "";
  const sector = typeof schema.sector === "string" ? schema.sector : "";
  const hasUndefinedFunctions = hasForbiddenFunctions(formulas);

  if (!hasFormulas) {
    issues.push("No formulas");
  }
  if (!hasOutputs) {
    issues.push("No primary output");
  }
  if (!hasValidInputs) {
    issues.push("No inputs");
  }
  if (!category || category === "Diğer") {
    issues.push('Uncategorized or "Diğer"');
  }
  if (!sector || sector === "Diğer") {
    issues.push('Missing sector or "Diğer"');
  }
  if (hasUndefinedFunctions) {
    issues.push("Undefined function in formula (f, g, calc, calculate)");
  }

  const industrial = validateIndustrialSchema(schema);
  if (!industrial.valid) {
    for (const error of industrial.errors) {
      if (!issues.includes(error)) {
        issues.push(error);
      }
    }
  }

  const fixable =
    issues.length > 0 &&
    !issues.some(
      (issue) => issue === "No formulas" || issue === "No primary output" || issue === "No inputs",
    );

  let status: TrustGateStatus = "PASS";
  if (!hasFormulas || !hasOutputs || !hasValidInputs) {
    status = "QUARANTINE";
  } else if (issues.length > 0) {
    status = "WARN";
  } else {
    status = "PASS";
  }

  return {
    slug,
    status,
    reason: issues[0],
    issues,
    fixable,
  };
}

export function runTrustGate(): TrustGateResult[] {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(SCHEMAS_DIR).filter((file) => file.endsWith("-schema.json"));
  const results: TrustGateResult[] = [];

  for (const file of files) {
    const filePath = path.join(SCHEMAS_DIR, file);
    const schema = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
    const slug = readSlug(schema, file);
    results.push(evaluateSchemaTrust(schema, slug));
  }

  return results;
}

export function getActiveSlugs(): string[] {
  return runTrustGate()
    .filter((result) => result.status === "PASS" || result.status === "WARN")
    .map((result) => result.slug)
    .sort((left, right) => left.localeCompare(right));
}

export function getDefaultCategoryFallback(): string {
  return DEFAULT_CATEGORY;
}
