/**
 * Smart form pilot batch QA registry - Phase 5H-G-I / 5H-H batch rollout.
 */

import { REVENUE_EVENTS } from "@/lib/infrastructure/analytics/revenue-events";
import { getControlledInputDesignPatch } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import {
  getPilotMappedSubmitKeys,
  isPilotCalculationBridgeEnabled,
} from "@/lib/features/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";
import { getRolloutBatchHEligibleToolDefinitions } from "@/components/tools/smart-form/rollout-batch-h-catalog";

export type SmartFormPilotExpectedAnalyticsEvent = {
  readonly eventName: string;
  readonly mode: "smart_form_pilot";
  readonly slugField: "slug";
  readonly toolSlugField: "toolSlug";
};

export type SmartFormPilotBatchRegistryEntry = {
  readonly pilotSlug: string;
  readonly routeSlug: string;
  readonly governanceSlug: string;
  readonly mappedSubmitKeys: readonly string[];
  readonly optionalGatedKeys: readonly string[];
  readonly derivedExcludedKeys: readonly string[];
  readonly assumptionExcludedKeys: readonly string[];
  readonly manualQaUrl: string;
  readonly expectedFallbackBehavior: string;
  readonly expectedAnalyticsEvents: readonly SmartFormPilotExpectedAnalyticsEvent[];
  readonly calculationBridgeEnabled: boolean;
};

const ANALYTICS_EVENT_TEMPLATE: readonly SmartFormPilotExpectedAnalyticsEvent[] = [
  {
    eventName: REVENUE_EVENTS.free_tool_started,
    mode: "smart_form_pilot",
    slugField: "slug",
    toolSlugField: "toolSlug",
  },
  {
    eventName: REVENUE_EVENTS.free_tool_completed,
    mode: "smart_form_pilot",
    slugField: "slug",
    toolSlugField: "toolSlug",
  },
];

function buildManualQaUrl(routeSlug: string): string {
  return `/tools/free/${routeSlug}`;
}

function buildRegistryEntry(params: {
  readonly routeSlug: string;
  readonly governanceSlug: string;
}): SmartFormPilotBatchRegistryEntry {
  const patch = getControlledInputDesignPatch(params.governanceSlug);
  const optionalGatedKeys = patch?.optionalInputs ?? [];
  const derivedExcludedKeys = patch?.derivedInputs ?? [];
  const assumptionExcludedKeys = patch?.defaultAssumptions.map((_, index) => `assumption-${index}`) ?? [];

  return {
    pilotSlug: params.governanceSlug,
    routeSlug: params.routeSlug,
    governanceSlug: params.governanceSlug,
    mappedSubmitKeys: getPilotMappedSubmitKeys(params.governanceSlug),
    optionalGatedKeys,
    derivedExcludedKeys,
    assumptionExcludedKeys,
    manualQaUrl: buildManualQaUrl(params.routeSlug),
    expectedFallbackBehavior:
      "NEXT_PUBLIC_SMART_FORM_PILOT=false keeps classic free form; flag true on non-pilot slugs keeps classic form.",
    expectedAnalyticsEvents: ANALYTICS_EVENT_TEMPLATE,
    calculationBridgeEnabled: isPilotCalculationBridgeEnabled(params.governanceSlug),
  };
}

export const SMART_FORM_PILOT_BATCH_REGISTRY: readonly SmartFormPilotBatchRegistryEntry[] =
  getRolloutBatchHEligibleToolDefinitions().map((tool) =>
    buildRegistryEntry({
      routeSlug: tool.routeSlug,
      governanceSlug: tool.governanceSlug,
    }),
  );

export function getSmartFormPilotBatchRegistry(): readonly SmartFormPilotBatchRegistryEntry[] {
  return SMART_FORM_PILOT_BATCH_REGISTRY;
}

export function getSmartFormPilotBatchEntryByRouteSlug(
  routeSlug: string,
): SmartFormPilotBatchRegistryEntry | undefined {
  return SMART_FORM_PILOT_BATCH_REGISTRY.find((entry) => entry.routeSlug === routeSlug);
}

export function getSmartFormPilotBatchEntryByGovernanceSlug(
  governanceSlug: string,
): SmartFormPilotBatchRegistryEntry | undefined {
  return SMART_FORM_PILOT_BATCH_REGISTRY.find((entry) => entry.governanceSlug === governanceSlug);
}
