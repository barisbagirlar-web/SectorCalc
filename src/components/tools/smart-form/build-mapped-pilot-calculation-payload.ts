/**
 * Generic mapped smart form pilot calculation payload - Phase 5H-H.
 */

import type { FreeToolInputValues } from "@/lib/features/tools/free-tool-results";
import {
  parsePilotNumericField,
  type PilotCalculationPayloadResult,
  type PilotFieldValues,
} from "@/components/tools/smart-form/pilot-calculation-payload";

export function buildMappedPilotCalculationPayload(
  submitKeys: readonly string[],
  fieldValues: PilotFieldValues,
): PilotCalculationPayloadResult {
  const errors: Record<string, string> = {};
  const payload: FreeToolInputValues = {};

  for (const key of submitKeys) {
    const parsed = parsePilotNumericField(fieldValues[key] ?? "");
    if (parsed === null) {
      errors[key] = `${key} must be a valid number.`;
      continue;
    }
    if (parsed < 0) {
      errors[key] = `${key} cannot be negative.`;
      continue;
    }
    payload[key] = parsed;
  }

  return {
    payload: Object.keys(errors).length === 0 ? payload : null,
    errors,
  };
}

export function isMappedPilotSubmitDisabled(
  submitKeys: readonly string[],
  fieldValues: PilotFieldValues,
): boolean {
  return submitKeys.some((key) => (fieldValues[key] ?? "").trim().length === 0);
}
