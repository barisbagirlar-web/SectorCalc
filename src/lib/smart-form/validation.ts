import type {
  SmartFormDefinition,
  SmartFormMode,
  SmartFormValidationResult,
  SmartInputRequirement,
} from "@/lib/smart-form/dynamic-form-types";
import { getRequiredInputs, getVisibleInputs } from "@/lib/smart-form/requirements";

function isEmptyValue(value: unknown): boolean {
  return value === undefined || value === null || value === "";
}

function parseNumeric(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return null;
    }
    const numeric = Number(trimmed);
    return Number.isFinite(numeric) ? numeric : null;
  }
  return null;
}

function normalizeInputValue(input: SmartInputRequirement, value: unknown): unknown {
  if (input.kind === "text" || input.kind === "select") {
    return typeof value === "string" ? value.trim() : value;
  }
  if (input.kind === "boolean") {
    return Boolean(value);
  }
  const numeric = parseNumeric(value);
  return numeric ?? value;
}

function validateInputValue(
  input: SmartInputRequirement,
  value: unknown,
): { readonly ok: boolean; readonly messageKey?: string } {
  if (isEmptyValue(value)) {
    return { ok: false, messageKey: "validation.required" };
  }

  if (input.kind === "text" || input.kind === "select") {
    return { ok: true };
  }

  const numeric = parseNumeric(value);
  if (numeric === null) {
    return { ok: false, messageKey: "validation.invalidNumber" };
  }
  if (input.min !== undefined && numeric < input.min) {
    return { ok: false, messageKey: "validation.min" };
  }
  if (input.max !== undefined && numeric > input.max) {
    return { ok: false, messageKey: "validation.max" };
  }

  return { ok: true };
}

function validateCombinationRules(
  definition: SmartFormDefinition,
  normalizedValues: Record<string, unknown>,
): Array<{ readonly key: string; readonly messageKey: string }> {
  const invalid: Array<{ readonly key: string; readonly messageKey: string }> = [];

  if (definition.toolSlug === "cnc-quote-risk-analyzer") {
    const machineRate = parseNumeric(normalizedValues.machineRate);
    if (machineRate !== null && machineRate <= 0) {
      invalid.push({ key: "machineRate", messageKey: "validation.invalidCombination" });
    }
    const quantity = parseNumeric(normalizedValues.quantity);
    if (quantity !== null && quantity < 1) {
      invalid.push({ key: "quantity", messageKey: "validation.invalidCombination" });
    }
  }

  if (definition.toolSlug === "welding-bid-risk-analyzer") {
    const laborHours = parseNumeric(normalizedValues.laborHours);
    const fitUpHours = parseNumeric(normalizedValues.fitUpHours);
    if (laborHours !== null && fitUpHours !== null && laborHours + fitUpHours <= 0) {
      invalid.push({ key: "laborHours", messageKey: "validation.invalidCombination" });
    }
  }

  if (definition.toolSlug === "hvac-project-margin-guard") {
    const laborHours = parseNumeric(normalizedValues.laborHours);
    const equipmentCost = parseNumeric(normalizedValues.equipmentCost);
    if (laborHours !== null && equipmentCost !== null && laborHours <= 0 && equipmentCost <= 0) {
      invalid.push({ key: "laborHours", messageKey: "validation.invalidCombination" });
    }
  }

  return invalid;
}

export function normalizeSmartFormValues(
  definition: SmartFormDefinition,
  values: Record<string, unknown>,
  mode: SmartFormMode,
  scenarioId: string,
): Record<string, unknown> {
  const visible = getVisibleInputs(definition, values, mode, scenarioId);
  const normalized: Record<string, unknown> = { ...values };

  for (const input of visible) {
    normalized[input.key] = normalizeInputValue(input, values[input.key]);
  }

  return normalized;
}

export function validateSmartForm(
  definition: SmartFormDefinition,
  values: Record<string, unknown>,
  mode: SmartFormMode,
  scenarioId: string,
): SmartFormValidationResult {
  const required = getRequiredInputs(definition, values, mode, scenarioId);
  const normalizedValues = normalizeSmartFormValues(definition, values, mode, scenarioId);
  const missing: string[] = [];
  const invalid: Array<{ key: string; messageKey: string }> = [];

  for (const input of required) {
    const value = normalizedValues[input.key];
    if (isEmptyValue(value)) {
      missing.push(input.key);
      continue;
    }
    const check = validateInputValue(input, value);
    if (!check.ok && check.messageKey) {
      invalid.push({ key: input.key, messageKey: check.messageKey });
    }
  }

  invalid.push(...validateCombinationRules(definition, normalizedValues));

  return {
    ok: missing.length === 0 && invalid.length === 0,
    missing,
    invalid,
    normalizedValues,
  };
}
