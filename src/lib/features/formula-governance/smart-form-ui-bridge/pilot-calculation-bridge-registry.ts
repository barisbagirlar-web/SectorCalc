/**
 * Smart form pilot calculation bridge registry - Phase 5H-G-G/H / 5H-H batch rollout.
 */

import {
  AUTO_SHOP_PILOT_SUBMIT_KEYS,
  CABINET_PILOT_SUBMIT_KEYS,
  ELECTRICAL_LABOR_PILOT_SUBMIT_KEYS,
  HVAC_TONNAGE_PILOT_SUBMIT_KEYS,
  LASER_CUTTING_PILOT_SUBMIT_KEYS,
  LAWN_CARE_PILOT_SUBMIT_KEYS,
  PLUMBING_FIXTURE_PILOT_SUBMIT_KEYS,
  PRINT_JOB_PILOT_SUBMIT_KEYS,
  THREE_D_PRINT_PILOT_SUBMIT_KEYS,
  WELDING_COST_PILOT_SUBMIT_KEYS,
} from "@/components/tools/smart-form/pilot-calculation-bridge-keys";
import { getRolloutBatchHActiveRouteMappings } from "@/components/tools/smart-form/rollout-batch-h-catalog";

export const THREE_D_PRINT_PILOT_GOVERNANCE_SLUG = "3d-print-cost-check" as const;
export const AUTO_SHOP_PILOT_GOVERNANCE_SLUG = "auto-shop-margin-leak-detector" as const;
export const AUTO_SHOP_PILOT_FREE_ROUTE_SLUG = "repair-time-vs-price-check" as const;
export const CABINET_PILOT_GOVERNANCE_SLUG = "cabinet-cost-estimator" as const;
export const ELECTRICAL_LABOR_PILOT_GOVERNANCE_SLUG = "electrical-labor-estimator" as const;
export const HVAC_TONNAGE_PILOT_GOVERNANCE_SLUG = "hvac-project-margin-guard" as const;
export const HVAC_TONNAGE_PILOT_FREE_ROUTE_SLUG = "hvac-tonnage-rule-check" as const;
export const LAWN_CARE_PILOT_GOVERNANCE_SLUG = "lawn-care-cost-check" as const;
export const PRINT_JOB_PILOT_GOVERNANCE_SLUG = "print-job-cost-check" as const;
export const PLUMBING_FIXTURE_PILOT_GOVERNANCE_SLUG = "plumbing-job-margin-verdict" as const;
export const PLUMBING_FIXTURE_PILOT_FREE_ROUTE_SLUG = "plumbing-fixture-cost-check" as const;
export const LASER_CUTTING_PILOT_GOVERNANCE_SLUG = "sheet-metal-quote-risk-tool" as const;
export const LASER_CUTTING_PILOT_FREE_ROUTE_SLUG = "laser-cutting-time-check" as const;
export const WELDING_COST_PILOT_GOVERNANCE_SLUG = "welding-bid-risk-analyzer" as const;
export const WELDING_COST_PILOT_FREE_ROUTE_SLUG = "welding-cost-estimator" as const;

export const PRODUCTION_DEPLOYED_PILOT_GOVERNANCE_SLUGS = [
  THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
  AUTO_SHOP_PILOT_GOVERNANCE_SLUG,
  CABINET_PILOT_GOVERNANCE_SLUG,
] as const;

export const PILOT_CALCULATION_BRIDGE_GOVERNANCE_SLUGS = [
  THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
  AUTO_SHOP_PILOT_GOVERNANCE_SLUG,
  CABINET_PILOT_GOVERNANCE_SLUG,
  ELECTRICAL_LABOR_PILOT_GOVERNANCE_SLUG,
  HVAC_TONNAGE_PILOT_GOVERNANCE_SLUG,
  LAWN_CARE_PILOT_GOVERNANCE_SLUG,
  PRINT_JOB_PILOT_GOVERNANCE_SLUG,
  PLUMBING_FIXTURE_PILOT_GOVERNANCE_SLUG,
  LASER_CUTTING_PILOT_GOVERNANCE_SLUG,
  WELDING_COST_PILOT_GOVERNANCE_SLUG,
] as const;

export type PilotCalculationBridgeGovernanceSlug =
  (typeof PILOT_CALCULATION_BRIDGE_GOVERNANCE_SLUGS)[number];

const FREE_ROUTE_TO_GOVERNANCE_SLUG: Readonly<Record<string, PilotCalculationBridgeGovernanceSlug>> =
  getRolloutBatchHActiveRouteMappings() as Readonly<Record<string, PilotCalculationBridgeGovernanceSlug>>;

export function resolvePilotGovernanceSlugFromRoute(routeSlug: string): string | null {
  if (routeSlug in FREE_ROUTE_TO_GOVERNANCE_SLUG) {
    return FREE_ROUTE_TO_GOVERNANCE_SLUG[routeSlug];
  }
  return null;
}

export function getPilotMappedSubmitKeys(governanceSlug: string): readonly string[] {
  switch (governanceSlug) {
    case THREE_D_PRINT_PILOT_GOVERNANCE_SLUG:
      return THREE_D_PRINT_PILOT_SUBMIT_KEYS;
    case AUTO_SHOP_PILOT_GOVERNANCE_SLUG:
      return AUTO_SHOP_PILOT_SUBMIT_KEYS;
    case CABINET_PILOT_GOVERNANCE_SLUG:
      return CABINET_PILOT_SUBMIT_KEYS;
    case ELECTRICAL_LABOR_PILOT_GOVERNANCE_SLUG:
      return ELECTRICAL_LABOR_PILOT_SUBMIT_KEYS;
    case HVAC_TONNAGE_PILOT_GOVERNANCE_SLUG:
      return HVAC_TONNAGE_PILOT_SUBMIT_KEYS;
    case LAWN_CARE_PILOT_GOVERNANCE_SLUG:
      return LAWN_CARE_PILOT_SUBMIT_KEYS;
    case PRINT_JOB_PILOT_GOVERNANCE_SLUG:
      return PRINT_JOB_PILOT_SUBMIT_KEYS;
    case PLUMBING_FIXTURE_PILOT_GOVERNANCE_SLUG:
      return PLUMBING_FIXTURE_PILOT_SUBMIT_KEYS;
    case LASER_CUTTING_PILOT_GOVERNANCE_SLUG:
      return LASER_CUTTING_PILOT_SUBMIT_KEYS;
    case WELDING_COST_PILOT_GOVERNANCE_SLUG:
      return WELDING_COST_PILOT_SUBMIT_KEYS;
    default:
      return [];
  }
}

export function isPilotCalculationBridgeEnabled(governanceSlug: string): boolean {
  return PILOT_CALCULATION_BRIDGE_GOVERNANCE_SLUGS.includes(
    governanceSlug as PilotCalculationBridgeGovernanceSlug,
  );
}

export function getPilotCalculationBridgeMappedInputCount(governanceSlug: string): number {
  return getPilotMappedSubmitKeys(governanceSlug).length;
}
