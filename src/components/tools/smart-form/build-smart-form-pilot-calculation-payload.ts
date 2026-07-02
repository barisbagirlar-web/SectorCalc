/**
 * Generic smart form pilot calculation payload dispatcher - Phase 5H-G-G/H / 5H-H.
 */

import { buildAutoShopPilotCalculationPayload } from "@/components/tools/smart-form/auto-shop-pilot-calculation-payload";
import { buildCabinetPilotCalculationPayload } from "@/components/tools/smart-form/cabinet-pilot-calculation-payload";
import { buildMappedPilotCalculationPayload } from "@/components/tools/smart-form/build-mapped-pilot-calculation-payload";
import {
  buildThreeDPrintPilotCalculationPayload,
  type PilotCalculationPayloadResult,
  type PilotFieldValues,
} from "@/components/tools/smart-form/pilot-calculation-payload";
import {
  AUTO_SHOP_PILOT_GOVERNANCE_SLUG,
  CABINET_PILOT_GOVERNANCE_SLUG,
  ELECTRICAL_LABOR_PILOT_GOVERNANCE_SLUG,
  HVAC_TONNAGE_PILOT_GOVERNANCE_SLUG,
  LASER_CUTTING_PILOT_GOVERNANCE_SLUG,
  LAWN_CARE_PILOT_GOVERNANCE_SLUG,
  PLUMBING_FIXTURE_PILOT_GOVERNANCE_SLUG,
  PRINT_JOB_PILOT_GOVERNANCE_SLUG,
  THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
  WELDING_COST_PILOT_GOVERNANCE_SLUG,
  getPilotMappedSubmitKeys,
} from "@/lib/features/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";
import type { SmartFormUiBridgeManifest } from "@/lib/features/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";

export type BuildSmartFormPilotCalculationPayloadParams = {
  readonly slug: string;
  readonly fieldValues: PilotFieldValues;
  readonly manifest: SmartFormUiBridgeManifest;
};

export type SmartFormPilotCalculationPayloadResult = PilotCalculationPayloadResult & {
  readonly supported: boolean;
};

const LEGACY_MANIFEST_PAYLOAD_BUILDERS: Readonly<
  Record<string, (params: BuildSmartFormPilotCalculationPayloadParams) => PilotCalculationPayloadResult>
> = {
  [THREE_D_PRINT_PILOT_GOVERNANCE_SLUG]: (params) =>
    buildThreeDPrintPilotCalculationPayload(params.fieldValues),
  [AUTO_SHOP_PILOT_GOVERNANCE_SLUG]: (params) =>
    buildAutoShopPilotCalculationPayload({
      fieldValues: params.fieldValues,
      manifest: params.manifest,
    }),
  [CABINET_PILOT_GOVERNANCE_SLUG]: (params) =>
    buildCabinetPilotCalculationPayload({
      fieldValues: params.fieldValues,
      manifest: params.manifest,
    }),
};

const BATCH_H_MAPPED_PAYLOAD_SLUGS = [
  ELECTRICAL_LABOR_PILOT_GOVERNANCE_SLUG,
  HVAC_TONNAGE_PILOT_GOVERNANCE_SLUG,
  LAWN_CARE_PILOT_GOVERNANCE_SLUG,
  PRINT_JOB_PILOT_GOVERNANCE_SLUG,
  PLUMBING_FIXTURE_PILOT_GOVERNANCE_SLUG,
  LASER_CUTTING_PILOT_GOVERNANCE_SLUG,
  WELDING_COST_PILOT_GOVERNANCE_SLUG,
] as const;

export function buildSmartFormPilotCalculationPayload(
  params: BuildSmartFormPilotCalculationPayloadParams,
): SmartFormPilotCalculationPayloadResult {
  const legacyBuilder = LEGACY_MANIFEST_PAYLOAD_BUILDERS[params.slug];
  if (legacyBuilder) {
    return { ...legacyBuilder(params), supported: true };
  }

  if (
    BATCH_H_MAPPED_PAYLOAD_SLUGS.includes(
      params.slug as (typeof BATCH_H_MAPPED_PAYLOAD_SLUGS)[number],
    )
  ) {
    const submitKeys = getPilotMappedSubmitKeys(params.slug);
    return {
      ...buildMappedPilotCalculationPayload(submitKeys, params.fieldValues),
      supported: true,
    };
  }

  return {
    payload: null,
    errors: {},
    supported: false,
  };
}
