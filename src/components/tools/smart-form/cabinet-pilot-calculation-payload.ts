/**
 * Cabinet smart form pilot calculation payload — Phase 5H-G-H (free production shape only).
 */

import type { FreeToolInputValues } from "@/lib/features/tools/free-tool-results";
import type { SmartFormUiBridgeManifest } from "@/lib/features/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";
import {
  CABINET_PILOT_SUBMIT_KEYS,
  type CabinetPilotSubmitKey,
} from "@/components/tools/smart-form/pilot-calculation-bridge-keys";
import {
  parsePilotNumericField,
  type PilotCalculationPayloadResult,
  type PilotFieldValues,
} from "@/components/tools/smart-form/pilot-calculation-payload";

export const CABINET_PILOT_SLUG = "cabinet-cost-estimator" as const;

export type BuildCabinetPilotCalculationPayloadParams = {
  readonly fieldValues: PilotFieldValues;
  readonly manifest: SmartFormUiBridgeManifest;
};

export function buildCabinetPilotCalculationPayload(
  params: BuildCabinetPilotCalculationPayloadParams,
): PilotCalculationPayloadResult {
  void params.manifest;

  const errors: Record<string, string> = {};
  const payload: FreeToolInputValues = {};

  for (const key of CABINET_PILOT_SUBMIT_KEYS) {
    const parsed = parsePilotNumericField(params.fieldValues[key] ?? "");
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

export function shouldIncludeCabinetFieldInPilotPayload(fieldKey: string): boolean {
  return CABINET_PILOT_SUBMIT_KEYS.includes(fieldKey as CabinetPilotSubmitKey);
}

export function isCabinetPilotSubmitDisabled(fieldValues: PilotFieldValues): boolean {
  return CABINET_PILOT_SUBMIT_KEYS.some((key) => (fieldValues[key] ?? "").trim().length === 0);
}
