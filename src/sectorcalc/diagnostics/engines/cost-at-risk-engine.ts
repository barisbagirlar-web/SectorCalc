import type { CostAtRiskInput, CostAtRiskOutput } from "../diagnostic-types";
import { DEFAULT_CAR_ASSUMPTIONS } from "../diagnostic-constants";

/**
 * Compute deterministic cost-at-risk.
 *
 * Formula:
 *   cost_at_risk =
 *     (scrap_probability * affected_quantity * material_cost_per_unit)
 *   + (rework_probability * affected_quantity * rework_hours_per_unit * blended_hourly_rate)
 *   + (downtime_hours * machine_hourly_rate)
 *   + expedite_or_delay_cost
 *
 * All values come from user input. No random, market, or AI estimates.
 */
export function computeCostAtRisk(input: CostAtRiskInput): CostAtRiskOutput {
  const scrapTerm =
    input.scrap_probability *
    input.affected_quantity *
    input.material_cost_per_unit;

  const reworkTerm =
    input.rework_probability *
    input.affected_quantity *
    input.rework_hours_per_unit *
    input.blended_hourly_rate;

  const downtimeTerm =
    input.downtime_hours * input.machine_hourly_rate;

  const costAtRisk =
    scrapTerm + reworkTerm + downtimeTerm + input.expedite_or_delay_cost;

  const assumptions: string[] = [...DEFAULT_CAR_ASSUMPTIONS];

  if (input.probability_source === "USER_ADJUSTED") {
    assumptions.push(
      "User-adjusted probabilities override industry default tables"
    );
  }

  return {
    cost_at_risk: costAtRisk,
    probability_source: input.probability_source,
    assumptions,
  };
}
