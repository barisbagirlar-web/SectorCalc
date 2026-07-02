/**
 * Pilot payload equivalence helper - Phase 5H-G-F (payload-only; no calculator calls).
 */

import type { FreeToolInputValues } from "@/lib/features/tools/free-tool-results";
import { THREE_D_PRINT_PILOT_SUBMIT_KEYS } from "@/components/tools/smart-form/pilot-calculation-payload";

export type PilotPayloadEquivalenceResult = {
  readonly equivalent: boolean;
  readonly differences: readonly string[];
};

export type ComparePilotPayloadWithBaselineParams = {
  readonly slug: string;
  readonly baselinePayload: FreeToolInputValues;
  readonly pilotPayload: FreeToolInputValues;
};

export function comparePilotPayloadWithBaseline(
  params: ComparePilotPayloadWithBaselineParams,
): PilotPayloadEquivalenceResult {
  const differences: string[] = [];

  for (const key of THREE_D_PRINT_PILOT_SUBMIT_KEYS) {
    const baselineValue = params.baselinePayload[key];
    const pilotValue = params.pilotPayload[key];

    if (baselineValue === undefined && pilotValue === undefined) {
      continue;
    }

    if (baselineValue === undefined || pilotValue === undefined) {
      differences.push(`${key}: missing in baseline or pilot payload`);
      continue;
    }

    if (baselineValue !== pilotValue) {
      differences.push(`${key}: baseline=${String(baselineValue)} pilot=${String(pilotValue)}`);
    }
  }

  const pilotExtraKeys = Object.keys(params.pilotPayload).filter(
    (key) => !THREE_D_PRINT_PILOT_SUBMIT_KEYS.includes(key as (typeof THREE_D_PRINT_PILOT_SUBMIT_KEYS)[number]),
  );

  for (const key of pilotExtraKeys) {
    differences.push(`${key}: unexpected pilot-only payload key`);
  }

  return {
    equivalent: differences.length === 0,
    differences,
  };
}

export function assertThreeDPrintPilotPayloadMatchesBaseline(
  baselinePayload: FreeToolInputValues,
  pilotPayload: FreeToolInputValues,
): void {
  const result = comparePilotPayloadWithBaseline({
    slug: "3d-print-cost-check",
    baselinePayload,
    pilotPayload,
  });

  if (!result.equivalent) {
    throw new Error(result.differences.join("; "));
  }
}
