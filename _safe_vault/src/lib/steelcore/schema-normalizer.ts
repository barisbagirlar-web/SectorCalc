import { compileFormulaExpression } from "@/lib/generated-tools/compile-formula-expression";
import { toSafeVarName } from "@/lib/generated-tools/export-names";

function isExpressionLike(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/[+\-*/^]/.test(trimmed) || trimmed.includes("Math.") || trimmed.includes("?")) return true;
  return /^[a-zA-Z_][a-zA-Z0-9_]*(\s*[+\-*/^]\s*[a-zA-Z0-9_.]+)*$/.test(trimmed);
}

function getInputIds(schema: Record<string, unknown>): string[] {
  const inputs = Array.isArray(schema.inputs) ? schema.inputs : [];
  return inputs
    .map((input) => (input && typeof input === "object" ? String((input as Record<string, unknown>).id ?? "") : ""))
    .filter(Boolean);
}

function formulaCompiles(
  expression: string,
  inputIds: readonly string[],
  formulaKeys: readonly string[],
  selfKey: string,
): boolean {
  const compiled = compileFormulaExpression(expression, {
    inputIds,
    inputToAccess: (inputId) => `input.${toSafeVarName(inputId)}`,
    formulaKeys,
    selfKey,
  });
  if (!compiled) {
    return false;
  }
  return !compiled.includes("Math.Math");
}

function normalizeSelectInputs(schema: Record<string, unknown>): boolean {
  const inputs = Array.isArray(schema.inputs) ? schema.inputs : [];
  let modified = false;
  for (const input of inputs) {
    if (!input || typeof input !== "object") {
      continue;
    }
    const record = input as Record<string, unknown>;
    if (record.type === "text" || record.type === "string" || record.type === "integer") {
      record.type = "number";
      modified = true;
    }
    if (!Array.isArray(record.options)) {
      continue;
    }
    const normalized = (record.options as unknown[]).map((option) => {
      if (typeof option === "string") return option;
      if (option && typeof option === "object") {
        const row = option as Record<string, unknown>;
        if (typeof row.value === "string") return row.value;
        if (typeof row.value === "number") return String(row.value);
        if (typeof row.label === "string") return row.label;
      }
      return String(option);
    });
    if (JSON.stringify(normalized) !== JSON.stringify(record.options)) {
      record.options = normalized;
      modified = true;
    }
  }
  return modified;
}

const FORBIDDEN_EXPRESSION_MARKERS = [
  "f(",
  "g(",
  "calc(",
  "calculate(",
  "concat(",
  "function(",
  "=>",
  "function ",
  "var ",
  "let ",
  "return ",
  "for (",
  ";",
  "inputs.",
  "[",
  "]",
] as const;

function hasForbiddenExpression(value: string): boolean {
  const lower = value.toLowerCase();
  return FORBIDDEN_EXPRESSION_MARKERS.some((marker) => lower.includes(marker));
}

export function normalizeSchemaMechanically(schema: Record<string, unknown>): boolean {
  let modified = false;

  if (!schema.validation || typeof schema.validation !== "object") {
    schema.validation = { rules: [], thresholds: {} };
    modified = true;
  }
  if (!Array.isArray(schema.premiumFeatures)) {
    schema.premiumFeatures = [];
    modified = true;
  }
  if (typeof schema.premiumRequired !== "boolean") {
    schema.premiumRequired = false;
    modified = true;
  }
  if (Array.isArray(schema.inputs) && schema.inputs.length > 8) {
    schema.inputs = schema.inputs.slice(0, 8);
    modified = true;
  }
  modified = normalizeSelectInputs(schema) || modified;

  if (!schema.formulas || typeof schema.formulas !== "object" || Array.isArray(schema.formulas)) {
    schema.formulas = {};
    modified = true;
  }

  const formulas = schema.formulas as Record<string, unknown>;
  const inputIds = getInputIds(schema);

  for (const [key, value] of Object.entries({ ...formulas })) {
    if (key.startsWith("__") || typeof value !== "string") {
      delete formulas[key];
      modified = true;
      continue;
    }
    const trimmed = value.trim();
    if (
      !trimmed ||
      trimmed.includes("${") ||
      trimmed.includes("{{") ||
      !isExpressionLike(trimmed) ||
      hasForbiddenExpression(trimmed)
    ) {
      delete formulas[key];
      modified = true;
    }
  }

  for (const key of Object.keys({ ...formulas })) {
    const value = formulas[key];
    if (typeof value !== "string" || !formulaCompiles(value, inputIds, Object.keys(formulas), key)) {
      delete formulas[key];
      modified = true;
    }
  }

  while (Object.keys(formulas).filter((key) => typeof formulas[key] === "string").length < 2) {
    const currentKeys = Object.keys(formulas).filter((key) => typeof formulas[key] === "string");
    if (currentKeys.length === 0) {
      break;
    }
    const onlyKey = currentKeys[0];
    const auxKey = `${onlyKey}_aux`;
    if (formulas[auxKey]) {
      break;
    }
    formulas[auxKey] = formulas[onlyKey] as string;
    modified = true;
  }
  if (Object.keys(formulas).length === 0 && inputIds.length > 0) {
    formulas.result = inputIds.slice(0, Math.min(3, inputIds.length)).join(" + ");
    modified = true;
  }

  const outputs =
    schema.outputs && typeof schema.outputs === "object"
      ? (schema.outputs as Record<string, unknown>)
      : {};
  schema.outputs = outputs;
  const refreshedKeys = Object.keys(formulas);
  const primary = typeof outputs.primary === "string" ? outputs.primary.trim() : "";
  if (!primary || !refreshedKeys.includes(primary)) {
    outputs.primary = refreshedKeys[refreshedKeys.length - 1] ?? "result";
    modified = true;
  }
  if (!Array.isArray(outputs.hiddenLossDrivers)) {
    outputs.hiddenLossDrivers = [];
    modified = true;
  }
  if (!Array.isArray(outputs.suggestedActions)) {
    outputs.suggestedActions = ["Review inputs and verify results against site standards."];
    modified = true;
  }
  if (typeof outputs.dataConfidenceAdjusted !== "string") {
    outputs.dataConfidenceAdjusted = refreshedKeys[refreshedKeys.length - 1] ?? "result";
    modified = true;
  }

  return modified;
}

export function mergeAiSchemaRepair(
  base: Record<string, unknown>,
  repaired: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...base, ...repaired };
  const baseInputs = Array.isArray(base.inputs) ? base.inputs : [];
  const repairedInputs = Array.isArray(repaired.inputs) ? repaired.inputs : [];
  if (repairedInputs.length > 0) {
    const byId = new Map<string, Record<string, unknown>>();
    for (const input of repairedInputs) {
      if (input && typeof input === "object") {
        const record = input as Record<string, unknown>;
        const id = typeof record.id === "string" ? record.id : "";
        if (id) byId.set(id, record);
      }
    }
    merged.inputs = baseInputs.map((input) => {
      if (!input || typeof input !== "object") return input;
      const record = input as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id : "";
      const patch = id ? byId.get(id) : undefined;
      if (!patch) return record;
      return {
        ...record,
        ...patch,
        label_i18n: patch.label_i18n ?? record.label_i18n,
        businessContext_i18n: patch.businessContext_i18n ?? record.businessContext_i18n,
      };
    });
  }
  if (!merged.validation || typeof merged.validation !== "object") {
    merged.validation = base.validation ?? { rules: [], thresholds: {} };
  }
  if (!Array.isArray(merged.premiumFeatures)) {
    merged.premiumFeatures = base.premiumFeatures ?? [];
  }
  return merged;
}

export function parseAiSchemaJson(raw: string): Record<string, unknown> {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i, "$1").trim();
  const parsed = JSON.parse(cleaned) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("AI response must be a JSON object.");
  }
  return parsed as Record<string, unknown>;
}
