import { compileFormulaExpression } from "@/lib/generated-tools/compile-formula-expression";
import { toSafeVarName } from "@/lib/generated-tools/export-names";
import {
  isStubSumFormula,
  validateIndustrialSchema,
} from "@/lib/generated-tools/validate-industrial-schema";
import type { RepairPatch, SchemaInput, SchemaRecord } from "./stub-formula-types";

function calculableInputIds(inputs: readonly SchemaInput[] | undefined): string[] {
  return (inputs ?? [])
    .filter((input) => input.type === "number" || input.type === undefined)
    .map((input) => input.id);
}

export function validateRepairPatch(schema: SchemaRecord, patch: RepairPatch): string | null {
  const merged: SchemaRecord = {
    ...schema,
    formulas: patch.formulas,
    outputs: { ...(schema.outputs as object), ...patch.outputs },
  };
  const inputIds = calculableInputIds(schema.inputs);
  const formulaKeys = Object.keys(patch.formulas);

  if (formulaKeys.length < 2) {
    return "fewer than 2 formulas";
  }

  const primary = patch.outputs.primary;
  if (typeof primary !== "string" || !patch.formulas[primary]) {
    return "outputs.primary missing in formulas";
  }

  if (isStubSumFormula(patch.formulas[primary], inputIds)) {
    return "primary formula still stub sum";
  }

  const usedInputs = inputIds.filter((id) =>
    Object.values(patch.formulas).some((expression) => expression.includes(id)),
  ).length;
  if (inputIds.length >= 4 && usedInputs < Math.ceil(inputIds.length / 2)) {
    return `formulas use only ${usedInputs}/${inputIds.length} numeric inputs`;
  }

  for (const [key, expression] of Object.entries(patch.formulas)) {
    const compiled = compileFormulaExpression(expression, {
      inputIds,
      inputToAccess: (inputId) => `input.${toSafeVarName(inputId)}`,
      formulaKeys,
      selfKey: key,
    });
    if (!compiled) {
      return `formula ${key} does not compile`;
    }
    if (isStubSumFormula(expression, inputIds)) {
      return `formula ${key} is stub sum`;
    }
  }

  const industrial = validateIndustrialSchema(merged);
  const calculableUsed = inputIds.filter((id) =>
    Object.values(patch.formulas).some((expression) => expression.includes(id)),
  ).length;
  const skipIncompleteModel =
    inputIds.length < 4 || calculableUsed >= inputIds.length;
  const critical = industrial.errors.filter((error) => {
    if (error.includes("incomplete domain model") && skipIncompleteModel) {
      return false;
    }
    return (
      error.includes("stub sum placeholder") ||
      error.includes("incomplete domain model") ||
      error.includes("output unit mismatch")
    );
  });
  if (critical.length > 0) {
    return critical.join("; ");
  }

  return null;
}
