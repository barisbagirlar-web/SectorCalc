/**
 * Smart form pilot calculation payload — Phase 5H-G-E/G (pure mapper; no calculator imports).
 */

import type { FreeToolInputValues } from "@/lib/features/tools/free-tool-results";
import type { SmartFormFieldComponentProps } from "@/lib/features/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";
import { canIncludeOptionalPilotField } from "@/components/tools/smart-form/optional-field-expansion-gate";
import {
  THREE_D_PRINT_PILOT_SUBMIT_KEYS,
  type ThreeDPrintPilotSubmitKey,
} from "@/components/tools/smart-form/pilot-calculation-bridge-keys";
import { isPilotMappedCalculationField } from "@/components/tools/smart-form/pilot-field-utils";

export {
  THREE_D_PRINT_PILOT_SUBMIT_KEYS,
  type ThreeDPrintPilotSubmitKey,
} from "@/components/tools/smart-form/pilot-calculation-bridge-keys";

export const THREE_D_PRINT_PILOT_SLUG = "3d-print-cost-check" as const;

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

/** @deprecated Use isPilotMappedCalculationField(field, governanceSlug) */
export function isPilotCalculationField(field: SmartFormFieldComponentProps): boolean {
  return isPilotMappedCalculationField(field, THREE_D_PRINT_PILOT_SLUG);
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

  for (const [fieldKey, rawValue] of Object.entries(fieldValues)) {
    if (THREE_D_PRINT_PILOT_SUBMIT_KEYS.includes(fieldKey as ThreeDPrintPilotSubmitKey)) {
      continue;
    }

    if (
      canIncludeOptionalPilotField({
        slug: THREE_D_PRINT_PILOT_SLUG,
        fieldKey,
        hasOutputDiffTest: false,
        isProductionMapped: false,
      })
    ) {
      const parsed = parsePilotNumericField(rawValue);
      if (parsed !== null && parsed > 0) {
        payload[fieldKey] = parsed;
      }
    }
  }

  return {
    payload: Object.keys(errors).length === 0 ? payload : null,
    errors,
  };
}

export function shouldIncludeFieldInPilotPayload(fieldKey: string): boolean {
  return THREE_D_PRINT_PILOT_SUBMIT_KEYS.includes(fieldKey as ThreeDPrintPilotSubmitKey);
}
