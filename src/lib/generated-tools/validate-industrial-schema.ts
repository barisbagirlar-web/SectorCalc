import { compileFormulaExpression } from "@/lib/generated-tools/compile-formula-expression";
import { toSafeVarName } from "@/lib/generated-tools/export-names";

const FORBIDDEN_FORMULA_PATTERNS = [
  /\bf\s*\(/,
  /\bg\s*\(/,
  /\bcalculate\s*\(/i,
  /\bsolve\s*\(/i,
] as const;

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
      errors.push(`formula ${key}: does not compile`);
    } else if (compiled.includes("Math.Math")) {
      errors.push(`formula ${key}: double Math prefix`);
    }
  }

  const outputs = raw.outputs as Record<string, unknown>;
  const primary = outputs.primary;
  if (typeof primary !== "string" || !formulaKeys.includes(primary)) {
    errors.push("outputs.primary missing or not in formulas");
  }

  return { valid: errors.length === 0, errors };
}
