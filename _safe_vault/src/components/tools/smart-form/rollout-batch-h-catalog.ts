/**
 * Smart form rollout batch H catalog — Phase 5H-H (15 input-design patch tools).
 */

import { ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";

export type RolloutBatchHEligibilityStatus = "eligible" | "excluded" | "live";

export type RolloutBatchHToolDefinition = {
  readonly governanceSlug: (typeof ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS)[number];
  readonly routeSlug: string;
  readonly submitKeys: readonly string[];
  readonly eligibilityStatus: RolloutBatchHEligibilityStatus;
  readonly exclusionReason: string | null;
};

export const ROLLOUT_BATCH_H_LIVE_GOVERNANCE_SLUGS = [
  "3d-print-cost-check",
  "auto-shop-margin-leak-detector",
  "cabinet-cost-estimator",
] as const;

export const ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_GOVERNANCE_SLUGS = [
  ...ROLLOUT_BATCH_H_LIVE_GOVERNANCE_SLUGS,
] as const;

export const ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_ROUTE_SLUGS = [
  "3d-print-cost-check",
  "repair-time-vs-price-check",
  "cabinet-cost-estimator",
] as const;

export const ROLLOUT_BATCH_H_ELIGIBLE_TOOL_COUNT = 10 as const;

const ROUTE_OWNERSHIP: Readonly<Record<string, string>> = {
  "repair-time-vs-price-check": "auto-shop-margin-leak-detector",
  "cabinet-cost-estimator": "cabinet-cost-estimator",
  "electrical-labor-estimator": "electrical-labor-estimator",
  "print-job-cost-check": "print-job-cost-check",
  "lawn-care-cost-check": "lawn-care-cost-check",
};

export const ROLLOUT_BATCH_H_TOOL_DEFINITIONS: readonly RolloutBatchHToolDefinition[] = [
  {
    governanceSlug: "3d-print-cost-check",
    routeSlug: "3d-print-cost-check",
    submitKeys: ["materialCost", "printHours", "machineRate"],
    eligibilityStatus: "live",
    exclusionReason: null,
  },
  {
    governanceSlug: "auto-shop-margin-leak-detector",
    routeSlug: "repair-time-vs-price-check",
    submitKeys: ["quotedPrice", "repairHours", "partsCost"],
    eligibilityStatus: "live",
    exclusionReason: null,
  },
  {
    governanceSlug: "cabinet-cost-estimator",
    routeSlug: "cabinet-cost-estimator",
    submitKeys: ["sheetMaterialCost", "laborHours", "installHours"],
    eligibilityStatus: "live",
    exclusionReason: null,
  },
  {
    governanceSlug: "electrical-labor-estimator",
    routeSlug: "electrical-labor-estimator",
    submitKeys: ["materialCost", "laborHours", "laborRate"],
    eligibilityStatus: "eligible",
    exclusionReason: null,
  },
  {
    governanceSlug: "hvac-project-margin-guard",
    routeSlug: "hvac-tonnage-rule-check",
    submitKeys: ["squareFootage", "tonnage", "laborHours"],
    eligibilityStatus: "eligible",
    exclusionReason: null,
  },
  {
    governanceSlug: "millwork-bid-risk-analyzer",
    routeSlug: "cabinet-cost-estimator",
    submitKeys: [],
    eligibilityStatus: "excluded",
    exclusionReason: "Premium-only patch; free route owned by cabinet-cost-estimator live pilot.",
  },
  {
    governanceSlug: "panel-shop-margin-verdict",
    routeSlug: "electrical-labor-estimator",
    submitKeys: [],
    eligibilityStatus: "excluded",
    exclusionReason: "Premium-only patch; free route owned by electrical-labor-estimator batch entry.",
  },
  {
    governanceSlug: "plumbing-job-margin-verdict",
    routeSlug: "plumbing-fixture-cost-check",
    submitKeys: ["fixtureCount", "laborHours"],
    eligibilityStatus: "eligible",
    exclusionReason: null,
  },
  {
    governanceSlug: "print-job-cost-check",
    routeSlug: "print-job-cost-check",
    submitKeys: ["materialCost", "designHours", "laborRate"],
    eligibilityStatus: "eligible",
    exclusionReason: null,
  },
  {
    governanceSlug: "repair-time-vs-price-check",
    routeSlug: "repair-time-vs-price-check",
    submitKeys: [],
    eligibilityStatus: "excluded",
    exclusionReason: "Free route owned by auto-shop-margin-leak-detector live pilot.",
  },
  {
    governanceSlug: "sheet-metal-quote-risk-tool",
    routeSlug: "laser-cutting-time-check",
    submitKeys: ["setupTime", "quantity"],
    eligibilityStatus: "eligible",
    exclusionReason: null,
  },
  {
    governanceSlug: "signage-bid-safe-price-tool",
    routeSlug: "print-job-cost-check",
    submitKeys: [],
    eligibilityStatus: "excluded",
    exclusionReason: "Premium-only patch; free route owned by print-job-cost-check batch entry.",
  },
  {
    governanceSlug: "welding-bid-risk-analyzer",
    routeSlug: "welding-cost-estimator",
    submitKeys: ["materialCost", "laborHours", "laborRate", "fitUpHours"],
    eligibilityStatus: "eligible",
    exclusionReason: null,
  },
  {
    governanceSlug: "landscaping-contract-profit-tool",
    routeSlug: "lawn-care-cost-check",
    submitKeys: [],
    eligibilityStatus: "excluded",
    exclusionReason: "Premium-only patch; free route owned by lawn-care-cost-check batch entry.",
  },
  {
    governanceSlug: "lawn-care-cost-check",
    routeSlug: "lawn-care-cost-check",
    submitKeys: ["crewHoursPerVisit", "visitsPerMonth"],
    eligibilityStatus: "eligible",
    exclusionReason: null,
  },
] as const;

export function getRolloutBatchHEligibleToolDefinitions(): readonly RolloutBatchHToolDefinition[] {
  return ROLLOUT_BATCH_H_TOOL_DEFINITIONS.filter(
    (tool) => tool.eligibilityStatus === "eligible" || tool.eligibilityStatus === "live",
  );
}

export function getRolloutBatchHExcludedToolDefinitions(): readonly RolloutBatchHToolDefinition[] {
  return ROLLOUT_BATCH_H_TOOL_DEFINITIONS.filter((tool) => tool.eligibilityStatus === "excluded");
}

export function getRolloutBatchHActiveRouteMappings(): Readonly<Record<string, string>> {
  const mappings: Record<string, string> = {};

  for (const tool of getRolloutBatchHEligibleToolDefinitions()) {
    const existingOwner = ROUTE_OWNERSHIP[tool.routeSlug];
    if (existingOwner && existingOwner !== tool.governanceSlug) {
      continue;
    }
    mappings[tool.routeSlug] = tool.governanceSlug;
  }

  return mappings;
}

export function getRolloutBatchHSubmitKeys(governanceSlug: string): readonly string[] {
  const tool = ROLLOUT_BATCH_H_TOOL_DEFINITIONS.find((entry) => entry.governanceSlug === governanceSlug);
  return tool?.submitKeys ?? [];
}
