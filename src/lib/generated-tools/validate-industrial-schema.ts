import { compileFormulaExpression } from "@/lib/generated-tools/compile-formula-expression";
import { toSafeVarName } from "@/lib/generated-tools/export-names";

const FORBIDDEN_FORMULA_PATTERNS = [
  /\bf\s*\(/,
  /\bg\s*\(/,
  /\bcalculate\s*\(/i,
  /\bsolve\s*\(/i,
] as const;

const NON_COST_OUTPUT_UNITS = new Set([
  "workers",
  "employees",
  "years",
  "units",
  "count",
  "ea",
  "each",
  "dimensionless",
]);

/** True when expression is only input identifiers joined by + (placeholder stub). */
export function isStubSumFormula(expression: string, inputIds: readonly string[]): boolean {
  const trimmed = expression.trim();
  if (!trimmed.includes("+")) {
    return false;
  }
  if (
    /[*/^%]|Math\.|\(|\)|\bsqrt\b|\blog\b|\bpow\b|\bmin\b|\bmax\b|\babs\b|\bexp\b/i.test(
      trimmed,
    )
  ) {
    return false;
  }
  const tokens = trimmed
    .split("+")
    .map((part) => part.trim())
    .filter(Boolean);
  if (tokens.length < 2) {
    return false;
  }
  const idSet = new Set(inputIds);
  return tokens.every((token) => idSet.has(token) || /^\d+(\.\d+)?$/.test(token));
}

function isCostOrientedTool(raw: Record<string, unknown>): boolean {
  const title = String(raw.title ?? "").toLowerCase();
  const description = String(raw.description ?? "").toLowerCase();
  const blob = `${title} ${description}`;
  return /cost|maliyet|price|fiyat|waste|kayıp|loss|roi|margin|karbon|carbon/.test(blob);
}

export type IndustrialValidationResult = {
  readonly valid: boolean;
  readonly errors: readonly string[];
};

export function validateIndustrialSchema(raw: Record<string, unknown>): IndustrialValidationResult {
  const errors: string[] = [];

  if (!raw.toolName) errors.push("missing toolName");
  if (!Array.isArray(raw.inputs) || raw.inputs.length === 0) {
    errors.push("inputs missing or empty");
  }
  if (!raw.formulas || typeof raw.formulas !== "object") {
    errors.push("formulas missing");
  }
  if (!raw.outputs || typeof raw.outputs !== "object") {
    errors.push("outputs missing");
  }
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const inputs = raw.inputs as Record<string, unknown>[];
  if (inputs.length < 3 || inputs.length > 8) {
    errors.push(`inputs count ${inputs.length} outside 3–8 range`);
  }

  const inputIds: string[] = [];
  for (const input of inputs) {
    const id = String(input.id ?? "");
    inputIds.push(id);
    const unit = input.unit;
    if (typeof unit !== "string" || !unit.trim()) {
      errors.push(`input ${id || "?"}: missing unit`);
    }
    const bc =
      typeof input.businessContext === "string"
        ? input.businessContext
        : (input.businessContext_i18n as Record<string, string> | undefined)?.en;
    if (typeof bc !== "string" || !bc.trim()) {
      errors.push(`input ${id || "?"}: missing businessContext`);
    }
  }

  const formulas = raw.formulas as Record<string, string>;
  const formulaKeys = Object.keys(formulas);
  if (formulaKeys.length < 2) {
    errors.push(`formulas count ${formulaKeys.length} < 2`);
  }

  let hasNonStubFormula = false;
  const stubFormulas: string[] = [];
  const formulaCompileErrors: string[] = [];

  for (const [key, expression] of Object.entries(formulas)) {
    if (typeof expression !== "string" || !expression.trim()) {
      errors.push(`formula ${key}: empty expression`);
      continue;
    }
    for (const pattern of FORBIDDEN_FORMULA_PATTERNS) {
      if (pattern.test(expression)) {
        errors.push(`formula ${key}: forbidden function call`);
      }
    }
    const compiled = compileFormulaExpression(expression, {
      inputIds,
      inputToAccess: (inputId) => `input.${toSafeVarName(inputId)}`,
      formulaKeys,
      selfKey: key,
    });
    if (!compiled) {
      formulaCompileErrors.push(key);
    } else if (compiled.includes("Math.Math")) {
      errors.push(`formula ${key}: double Math prefix`);
    } else if (isStubSumFormula(expression, inputIds)) {
      stubFormulas.push(key);
    } else {
      hasNonStubFormula = true;
    }
  }

  // Report compile errors after loop
  for (const key of formulaCompileErrors) {
    errors.push(`formula ${key}: does not compile`);
  }

  // Only flag formulas as stub-sums when ALL formulas are stub sums
  // (intermediate aggregation like totalCost = a + b + c is legitimate)
  if (!hasNonStubFormula && stubFormulas.length > 0) {
    for (const key of stubFormulas) {
      errors.push(`formula ${key}: stub sum placeholder (all formulas are input sums)`);
    }
  }

  const outputs = raw.outputs as Record<string, unknown>;
  const primary = outputs.primary;
  if (typeof primary !== "string" || !formulaKeys.includes(primary)) {
    errors.push("outputs.primary missing or not in formulas");
  } else {
    const primaryExpr = formulas[primary];
    const usedInputs = inputIds.filter((id) =>
      Object.values(formulas).some((expression) => expression.includes(id)),
    ).length;
    if (inputIds.length >= 4 && usedInputs < Math.ceil(inputIds.length / 2)) {
      errors.push(
        `formulas use ${usedInputs}/${inputIds.length} inputs — incomplete domain model`,
      );
    }
    if (!hasNonStubFormula && isStubSumFormula(primaryExpr, inputIds)) {
      errors.push(`primary formula ${primary}: stub sum placeholder (all formulas are input sums)`);
    }
  }

  const outputUnit = typeof outputs.unit === "string" ? outputs.unit.trim().toLowerCase() : "";
  if (isCostOrientedTool(raw) && outputUnit && NON_COST_OUTPUT_UNITS.has(outputUnit)) {
    errors.push(`output unit mismatch: cost-oriented tool publishes "${outputs.unit}"`);
  }

  return { valid: errors.length === 0, errors };
}
