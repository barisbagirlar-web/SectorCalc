/**
 * Optional smart form pilot field expansion gate — Phase 5H-G-F.
 */

import { THREE_D_PRINT_PILOT_SLUG } from "@/components/tools/smart-form/pilot-calculation-payload";

export const THREE_D_PRINT_OPTIONAL_PILOT_CANDIDATES = [
  "failedPrintRate",
  "supportMaterialCost",
  "energyCost",
  "setupTime",
] as const;

export type CanIncludeOptionalPilotFieldParams = {
  readonly slug: string;
  readonly fieldKey: string;
  readonly hasOutputDiffTest: boolean;
  readonly isProductionMapped: boolean;
};

export function canIncludeOptionalPilotField(
  params: CanIncludeOptionalPilotFieldParams,
): boolean {
  if (params.slug !== THREE_D_PRINT_PILOT_SLUG) {
    return false;
  }

  if (!params.isProductionMapped) {
    return false;
  }

  if (!params.hasOutputDiffTest) {
    return false;
  }

  if (
    !THREE_D_PRINT_OPTIONAL_PILOT_CANDIDATES.includes(
      params.fieldKey as (typeof THREE_D_PRINT_OPTIONAL_PILOT_CANDIDATES)[number],
    )
  ) {
    return false;
  }

  return false;
}
