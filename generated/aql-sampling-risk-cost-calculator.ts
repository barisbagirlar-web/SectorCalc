// Auto-generated from aql-sampling-risk-cost-calculator-schema.json
import * as z from 'zod';

export interface Aql_sampling_risk_cost_calculatorInput {
  lot_size: number;
  aql_percent: number;
  inspection_level: string;
  sampling_plan_type: string;
  unit_cost: number;
  defect_cost_per_unit: number;
  inspection_cost_per_unit: number;
  defect_rate_actual: number;
  confidence_level: string;
}

export const Aql_sampling_risk_cost_calculatorInputSchema = z.object({
  lot_size: z.number().min(2).max(1000000).default(1000),
  aql_percent: z.number().min(0.01).max(10).default(1),
  inspection_level: z.enum(['I', 'II', 'III', 'S-1', 'S-2', 'S-3', 'S-4']).default('II'),
  sampling_plan_type: z.enum(['normal', 'tightened', 'reduced']).default('normal'),
  unit_cost: z.number().min(0.01).max(100000).default(10),
  defect_cost_per_unit: z.number().min(0).max(1000000).default(50),
  inspection_cost_per_unit: z.number().min(0).max(1000).default(2),
  defect_rate_actual: z.number().min(0).max(100).default(2),
  confidence_level: z.enum(['90', '95', '99']).default('95'),
});

function evaluateAllFormulas(input: Aql_sampling_risk_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = f(input.lot_size, input.inspection_level, input.sampling_plan_type); results["sample_size"] = Number.isFinite(v) ? v : 0; } catch { results["sample_size"] = 0; }
  try { const v = g(n, input.aql_percent); results["accept_number"] = Number.isFinite(v) ? v : 0; } catch { results["accept_number"] = 0; }
  results["probability_acceptance"] = 0;
  try { const v = 1 - Pa(p = AQL); results["producer_risk"] = Number.isFinite(v) ? v : 0; } catch { results["producer_risk"] = 0; }
  results["consumer_risk"] = 0;
  try { const v = (1 - Pa) * input.lot_size * input.defect_rate_actual * input.defect_cost_per_unit + Pa * input.lot_size * input.defect_rate_actual * input.defect_cost_per_unit * (1 - inspection_effectiveness); results["expected_defect_cost"] = Number.isFinite(v) ? v : 0; } catch { results["expected_defect_cost"] = 0; }
  try { const v = ((results["sample_size"] ?? 0) * input.inspection_cost_per_unit) + ExpectedDefectCost + ((results["producer_risk"] ?? 0) * input.lot_size * input.unit_cost * 0.1) + ((results["consumer_risk"] ?? 0) * input.lot_size * input.defect_cost_per_unit * 0.2); results["total_risk_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_risk_cost"] = 0; }
  return results;
}


export function calculateAql_sampling_risk_cost_calculator(input: Aql_sampling_risk_cost_calculatorInput): Aql_sampling_risk_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_risk_cost"] ?? 0;
  const breakdown = {
    inspection_cost: values["inspection_cost"] ?? 0,
    expected_defect_cost: values["expected_defect_cost"] ?? 0,
    producer_risk_cost: values["producer_risk_cost"] ?? 0,
    consumer_risk_cost: values["consumer_risk_cost"] ?? 0,
    sample_size: values["sample_size"] ?? 0,
    accept_number: values["accept_number"] ?? 0,
    probability_acceptance: values["probability_acceptance"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["High Actual Defect Rate","Low Inspection Effectiveness","Sampling Plan Mismatch"];
  const suggestedActions: string[] = ["Reduce Actual Defect Rate","Switch to Tightened Inspection","Increase Sample Size","Automate Inspection"];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-lot aggregation","Supplier risk scoring"],
  };
}


export interface Aql_sampling_risk_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { inspection_cost: number; expected_defect_cost: number; producer_risk_cost: number; consumer_risk_cost: number; sample_size: number; accept_number: number; probability_acceptance: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
