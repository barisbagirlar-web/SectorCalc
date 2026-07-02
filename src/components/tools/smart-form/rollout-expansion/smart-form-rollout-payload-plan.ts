/**
 * Smart form rollout expansion payload plan - Phase 5I-H submit key policy.
 */

import { getRolloutBatchHSubmitKeys } from "@/components/tools/smart-form/rollout-batch-h-catalog";
import { getPilotMappedSubmitKeys } from "@/lib/features/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";
import type { SmartFormRolloutPayloadPlan } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-types";

const DERIVED_KEY_PATTERNS = ["derived", "computed", "calculated"] as const;
const ASSUMPTION_KEY_PATTERNS = ["assumption", "default", "preset"] as const;
const OPTIONAL_KEY_PATTERNS = ["optional", "advanced", "extra"] as const;

function matchesPattern(key: string, patterns: readonly string[]): boolean {
  const lower = key.toLowerCase();
  return patterns.some((pattern) => lower.includes(pattern));
}

export function buildRolloutPayloadPlan(
  governanceSlug: string,
  optionalGateOpen = false,
): SmartFormRolloutPayloadPlan {
  const catalogKeys = getRolloutBatchHSubmitKeys(governanceSlug);
  const bridgeKeys = getPilotMappedSubmitKeys(governanceSlug);
  const sourceKeys = bridgeKeys.length > 0 ? bridgeKeys : catalogKeys;

  const allowedSubmitKeys = sourceKeys.filter(
    (key) =>
      !matchesPattern(key, DERIVED_KEY_PATTERNS) &&
      !matchesPattern(key, ASSUMPTION_KEY_PATTERNS) &&
      (optionalGateOpen || !matchesPattern(key, OPTIONAL_KEY_PATTERNS)),
  );

  const excludedDerivedKeys = sourceKeys.filter((key) => matchesPattern(key, DERIVED_KEY_PATTERNS));
  const excludedAssumptionKeys = sourceKeys.filter((key) =>
    matchesPattern(key, ASSUMPTION_KEY_PATTERNS),
  );
  const excludedOptionalKeys = sourceKeys.filter((key) => matchesPattern(key, OPTIONAL_KEY_PATTERNS));

  return {
    governanceSlug,
    allowedSubmitKeys,
    excludedDerivedKeys,
    excludedAssumptionKeys,
    excludedOptionalKeys,
    optionalGateOpen,
  };
}

export function buildPayloadForSubmit(
  governanceSlug: string,
  values: Readonly<Record<string, unknown>>,
  optionalGateOpen = false,
): Record<string, unknown> {
  const plan = buildRolloutPayloadPlan(governanceSlug, optionalGateOpen);
  const payload: Record<string, unknown> = {};

  for (const key of plan.allowedSubmitKeys) {
    if (key in values) {
      payload[key] = values[key];
    }
  }

  return payload;
}
