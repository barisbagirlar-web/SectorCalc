/**
 * Auto shop smart form pilot calculation payload - Phase 5H-G-G (free production shape only).
 */

import type { FreeToolInputValues } from "@/lib/features/tools/free-tool-results";
import type { SmartFormUiBridgeManifest } from "@/lib/features/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";
import {
  AUTO_SHOP_PILOT_SUBMIT_KEYS,
  type AutoShopPilotSubmitKey,
} from "@/components/tools/smart-form/pilot-calculation-bridge-keys";
import {
  parsePilotNumericField,
  type PilotCalculationPayloadResult,
  type PilotFieldValues,
} from "@/components/tools/smart-form/pilot-calculation-payload";

export const AUTO_SHOP_PILOT_SLUG = "auto-shop-margin-leak-detector" as const;

export type BuildAutoShopPilotCalculationPayloadParams = {
  readonly fieldValues: PilotFieldValues;
  readonly manifest: SmartFormUiBridgeManifest;
};

export function buildAutoShopPilotCalculationPayload(
  params: BuildAutoShopPilotCalculationPayloadParams,
): PilotCalculationPayloadResult {
  void params.manifest;

  const errors: Record<string, string> = {};
  const payload: FreeToolInputValues = {};

  for (const key of AUTO_SHOP_PILOT_SUBMIT_KEYS) {
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

export function shouldIncludeAutoShopFieldInPilotPayload(fieldKey: string): boolean {
  return AUTO_SHOP_PILOT_SUBMIT_KEYS.includes(fieldKey as AutoShopPilotSubmitKey);
}

export function isAutoShopPilotSubmitDisabled(fieldValues: PilotFieldValues): boolean {
  return AUTO_SHOP_PILOT_SUBMIT_KEYS.some((key) => (fieldValues[key] ?? "").trim().length === 0);
}
