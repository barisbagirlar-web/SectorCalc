// Auto-generated from msa-gage-rr-cost-schema.json
import * as z from 'zod';

export interface Msa_gage_rr_costInput {
  num_parts: number;
  num_appraisers: number;
  num_trials: number;
  total_variation: number;
  repeatability_variation: number;
  reproducibility_variation: number;
  cost_per_defect: number;
  cost_per_escaped_defect: number;
  annual_production_volume: number;
  defect_rate: number;
  measurement_system_type: string;
  include_hidden_losses: boolean;
}

export const Msa_gage_rr_costInputSchema = z.object({
  num_parts: z.number().min(2).max(100).default(10),
  num_appraisers: z.number().min(2).max(10).default(3),
  num_trials: z.number().min(2).max(10).default(3),
  total_variation: z.number().min(0.001).max(100).default(0.5),
  repeatability_variation: z.number().min(0).max(100).default(0.15),
  reproducibility_variation: z.number().min(0).max(100).default(0.1),
  cost_per_defect: z.number().min(0).max(100000).default(50),
  cost_per_escaped_defect: z.number().min(0).max(1000000).default(500),
  annual_production_volume: z.number().min(1).max(100000000).default(100000),
  defect_rate: z.number().min(0).max(1000000).default(5000),
  measurement_system_type: z.enum(['variable', 'attribute']).default('variable'),
  include_hidden_losses: z.boolean().default(true),
});

function evaluateAllFormulas(input: Msa_gage_rr_costInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(input.repeatability_variation**2 + input.reproducibility_variation**2); results["grr_variation"] = Number.isFinite(v) ? v : 0; } catch { results["grr_variation"] = 0; }
  try { const v = ((results["grr_variation"] ?? 0) / input.total_variation) * 100; results["pct_grr"] = Number.isFinite(v) ? v : 0; } catch { results["pct_grr"] = 0; }
  try { const v = Math.floor((input.total_variation / (results["grr_variation"] ?? 0)) * Math.sqrt(2)); results["ndc"] = Number.isFinite(v) ? v : 0; } catch { results["ndc"] = 0; }
  try { const v = input.defect_rate * ((results["pct_grr"] ?? 0) / 100) * 0.5; results["misclassification_rate"] = Number.isFinite(v) ? v : 0; } catch { results["misclassification_rate"] = 0; }
  try { const v = (input.defect_rate / 1e6) * input.annual_production_volume * input.cost_per_defect; results["annual_internal_failure_cost"] = Number.isFinite(v) ? v : 0; } catch { results["annual_internal_failure_cost"] = 0; }
  try { const v = (input.defect_rate / 1e6) * input.annual_production_volume * input.cost_per_escaped_defect * 0.1; results["annual_external_failure_cost"] = Number.isFinite(v) ? v : 0; } catch { results["annual_external_failure_cost"] = 0; }
  try { const v = ((results["misclassification_rate"] ?? 0) / 1e6) * input.annual_production_volume * (input.cost_per_defect + input.cost_per_escaped_defect) * 0.5; results["annual_hidden_loss_cost"] = Number.isFinite(v) ? v : 0; } catch { results["annual_hidden_loss_cost"] = 0; }
  try { const v = (results["annual_internal_failure_cost"] ?? 0) + (results["annual_external_failure_cost"] ?? 0) + (input.include_hidden_losses ? (results["annual_hidden_loss_cost"] ?? 0) : 0); results["total_annual_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_annual_cost"] = 0; }
  return results;
}


export function calculateMsa_gage_rr_cost(input: Msa_gage_rr_costInput): Msa_gage_rr_costOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_annual_cost"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    components: values["components"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["%GRR","Number of Distinct Categories","Misclassification Rate"];
  const suggestedActions: string[] = ["Improve Gage Repeatability","Standardize Measurement Procedure","Increase Number of Distinct Categories","Review Tolerances and Specifications"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Custom threshold configuration"],
  };
}


export interface Msa_gage_rr_costOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; components: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
