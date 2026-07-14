import "server-only";

import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import type {
  ProFormulaModule,
  ProFormulaResult,
} from "./pro-formula-contract";

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

function sameSet(left: readonly string[], right: readonly string[]): boolean {
  const a = sortedUnique(left);
  const b = sortedUnique(right);
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function duplicateValues(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates].sort();
}

export function isStrictFormulaSchemaContractEnabled(
  schema: SuperV4Schema,
): boolean {
  return (
    (schema.engine_rules as Record<string, unknown> | undefined)
      ?.strict_formula_schema_contract === true
  );
}

export function validateFormulaModuleBinding(
  schema: SuperV4Schema,
  module: ProFormulaModule,
  normalizedInputs: Record<string, number>,
): string[] {
  if (!isStrictFormulaSchemaContractEnabled(schema)) return [];

  const errors: string[] = [];
  const schemaInputIds = schema.normalized_inputs.map((input) => input.id);
  const schemaOutputIds = schema.outputs.map((output) => output.id);
  const declaredInputIds = module.requiredInputKeys ?? Object.keys(module.sampleInputs);
  const declaredOutputIds = module.declaredOutputKeys ?? [];
  const runtimeInputIds = Object.keys(normalizedInputs);

  for (const duplicate of duplicateValues(schemaInputIds)) {
    errors.push(`Duplicate schema normalized input id: ${duplicate}`);
  }
  for (const duplicate of duplicateValues(schemaOutputIds)) {
    errors.push(`Duplicate schema output id: ${duplicate}`);
  }

  if (module.toolKey !== schema.tool_key) {
    errors.push(
      `Formula tool key ${module.toolKey} does not match schema tool key ${schema.tool_key}.`,
    );
  }

  if (!module.formulaVersion) {
    errors.push("Strict formula module must export formulaVersion.");
  } else if (module.formulaVersion !== schema.metadata.formula_version) {
    errors.push(
      `Formula version ${module.formulaVersion} does not match schema version ${schema.metadata.formula_version}.`,
    );
  }

  if (!sameSet(schemaInputIds, declaredInputIds)) {
    errors.push(
      `Formula declared input set does not match schema normalized inputs. Schema=[${sortedUnique(schemaInputIds).join(", ")}], Formula=[${sortedUnique(declaredInputIds).join(", ")}].`,
    );
  }

  if (!sameSet(schemaInputIds, Object.keys(module.sampleInputs))) {
    errors.push(
      "Formula sample input keys do not exactly match schema normalized inputs.",
    );
  }

  if (!sameSet(schemaInputIds, runtimeInputIds)) {
    errors.push(
      `Runtime normalized input set does not match schema. Schema=[${sortedUnique(schemaInputIds).join(", ")}], Runtime=[${sortedUnique(runtimeInputIds).join(", ")}].`,
    );
  }

  if (declaredOutputIds.length === 0) {
    errors.push("Strict formula module must export declaredOutputKeys.");
  } else if (!sameSet(schemaOutputIds, declaredOutputIds)) {
    errors.push(
      `Formula declared output set does not match schema outputs. Schema=[${sortedUnique(schemaOutputIds).join(", ")}], Formula=[${sortedUnique(declaredOutputIds).join(", ")}].`,
    );
  }

  return errors;
}

export function validateFormulaResultContract(
  schema: SuperV4Schema,
  module: ProFormulaModule,
  result: ProFormulaResult,
): string[] {
  if (!isStrictFormulaSchemaContractEnabled(schema)) return [];

  const errors: string[] = [];
  const schemaOutputIds = schema.outputs.map((output) => output.id);
  const resultOutputIds = Object.keys(result.outputs);
  const outputKeys = result.outputKeys;
  const declaredOutputIds = module.declaredOutputKeys ?? [];

  if (!sameSet(schemaOutputIds, resultOutputIds)) {
    errors.push(
      `Formula result output set does not match schema outputs. Schema=[${sortedUnique(schemaOutputIds).join(", ")}], Result=[${sortedUnique(resultOutputIds).join(", ")}].`,
    );
  }

  if (!sameSet(resultOutputIds, outputKeys)) {
    errors.push("Formula result outputKeys do not match the actual output object keys.");
  }

  if (declaredOutputIds.length > 0 && !sameSet(resultOutputIds, declaredOutputIds)) {
    errors.push("Formula result outputs do not match declaredOutputKeys.");
  }

  for (const [outputId, value] of Object.entries(result.outputs)) {
    if (!Number.isFinite(value)) {
      errors.push(`Formula result ${outputId} is non-finite.`);
    }
  }

  if (!["OK", "REVIEW", "BLOCKED"].includes(result.status)) {
    errors.push(`Unsupported formula status: ${String(result.status)}.`);
  }

  if (result.redaction_status !== "PUBLIC_SAFE_REDACTED") {
    errors.push(
      `Strict public formula result must be PUBLIC_SAFE_REDACTED, got ${result.redaction_status}.`,
    );
  }

  return errors;
}
