/**
 * Generic smart form pilot calculation payload dispatcher — Phase 5H-G-G/H.
 */

import { buildAutoShopPilotCalculationPayload } from "@/components/tools/smart-form/auto-shop-pilot-calculation-payload";
import { buildCabinetPilotCalculationPayload } from "@/components/tools/smart-form/cabinet-pilot-calculation-payload";
import {
  buildThreeDPrintPilotCalculationPayload,
  type PilotCalculationPayloadResult,
  type PilotFieldValues,
} from "@/components/tools/smart-form/pilot-calculation-payload";
import {
  AUTO_SHOP_PILOT_GOVERNANCE_SLUG,
  CABINET_PILOT_GOVERNANCE_SLUG,
  THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
} from "@/lib/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";
import type { SmartFormUiBridgeManifest } from "@/lib/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";

export type BuildSmartFormPilotCalculationPayloadParams = {
  readonly slug: string;
  readonly fieldValues: PilotFieldValues;
  readonly manifest: SmartFormUiBridgeManifest;
};

export type SmartFormPilotCalculationPayloadResult = PilotCalculationPayloadResult & {
  readonly supported: boolean;
};

export function buildSmartFormPilotCalculationPayload(
  params: BuildSmartFormPilotCalculationPayloadParams,
): SmartFormPilotCalculationPayloadResult {
  switch (params.slug) {
    case THREE_D_PRINT_PILOT_GOVERNANCE_SLUG: {
      const result = buildThreeDPrintPilotCalculationPayload(params.fieldValues);
      return { ...result, supported: true };
    }
    case AUTO_SHOP_PILOT_GOVERNANCE_SLUG: {
      const result = buildAutoShopPilotCalculationPayload({
        fieldValues: params.fieldValues,
        manifest: params.manifest,
      });
      return { ...result, supported: true };
    }
    case CABINET_PILOT_GOVERNANCE_SLUG: {
      const result = buildCabinetPilotCalculationPayload({
        fieldValues: params.fieldValues,
        manifest: params.manifest,
      });
      return { ...result, supported: true };
    }
    default:
      return {
        payload: null,
        errors: {},
        supported: false,
      };
  }
}
