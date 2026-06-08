/**
 * Smart form pilot calculation payload — Phase 5H-G-E (pure mapper; no calculator imports).
 */

import type { FreeToolInputValues } from "@/lib/tools/free-tool-results";
import type { SmartFormFieldComponentProps } from "@/lib/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";

export const THREE_D_PRINT_PILOT_SLUG = "3d-print-cost-check" as const;

export const THREE_D_PRINT_PILOT_SUBMIT_KEYS = [
  "materialCost",
  "printHours",
  "machineRate",
] as const;

export type ThreeDPrintPilotSubmitKey = (typeof THREE_D_PRINT_PILOT_SUBMIT_KEYS)[number];

export type PilotFieldValues = Readonly<Record<string, string>>;

export type PilotCalculationPayloadResult = {
  readonly payload: FreeToolInputValues | null;
  readonly errors: Readonly<Record<string, string>>;
};

export function parsePilotNumericField(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

export function isPilotCalculationField(field: SmartFormFieldComponentProps): boolean {
  return (
    field.componentKind === "field_input" &&
    field.editable &&
    THREE_D_PRINT_PILOT_SUBMIT_KEYS.includes(field.key as ThreeDPrintPilotSubmitKey)
  );
}

export function isThreeDPrintPilotSubmitDisabled(fieldValues: PilotFieldValues): boolean {
  return THREE_D_PRINT_PILOT_SUBMIT_KEYS.some((key) => (fieldValues[key] ?? "").trim().length === 0);
}

export function buildThreeDPrintPilotCalculationPayload(
  fieldValues: PilotFieldValues,
): PilotCalculationPayloadResult {
  const errors: Record<string, string> = {};
  const payload: FreeToolInputValues = {};

  for (const key of THREE_D_PRINT_PILOT_SUBMIT_KEYS) {
    const parsed = parsePilotNumericField(fieldValues[key] ?? "");
    if (parsed === null) {
      errors[key] = `${key} must be a valid number.`;
      continue;
    }
    if (parsed <= 0) {
      errors[key] = `${key} must be greater than 0.`;
      continue;
    }
    payload[key] = parsed;
  }

  return {
    payload: Object.keys(errors).length === 0 ? payload : null,
    errors,
  };
}

export function shouldIncludeFieldInPilotPayload(fieldKey: string): boolean {
  return THREE_D_PRINT_PILOT_SUBMIT_KEYS.includes(fieldKey as ThreeDPrintPilotSubmitKey);
}
