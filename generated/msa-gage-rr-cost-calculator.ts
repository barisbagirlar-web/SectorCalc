// Auto-generated from msa-gage-rr-cost-calculator-schema.json
import * as z from 'zod';

export interface Msa_gage_rr_cost_calculatorInput {
  num_parts: number;
  num_appraisers: number;
  num_trials: number;
  total_variation: number;
  repeatability_variation: number;
  reproducibility_variation: number;
  cost_per_defect: number;
  cost_per_escaped_defect: number;
  dataConfidence?: number;
}

export const Msa_gage_rr_cost_calculatorInputSchema = z.object({
  num_parts: z.number().min(2).max(100).default(10),
  num_appraisers: z.number().min(2).max(10).default(3),
  num_trials: z.number().min(2).max(10).default(3),
  total_variation: z.number().min(0.001).max(100).default(0.5),
  repeatability_variation: z.number().min(0).max(100).default(0.15),
  reproducibility_variation: z.number().min(0).max(100).default(0.1),
  cost_per_defect: z.number().min(0).max(100000).default(50),
  cost_per_escaped_defect: z.number().min(0).max(1000000).default(500),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Msa_gage_rr_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_exposure_hours"] = 0; }
  try { const v = input.num_parts * 1 * 1 * input.cost_per_defect; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["direct_labor_cost"] = 0; }
  try { const v = input.num_parts * 1 * 1 * input.cost_per_defect * (input.num_appraisers * input.num_trials); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.num_appraisers; results["factor_num_appraisers"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_num_appraisers"] = 0; }
  try { const v = input.num_trials; results["factor_num_trials"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_num_trials"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMsa_gage_rr_cost_calculator(input: Msa_gage_rr_cost_calculatorInput): Msa_gage_rr_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates"];
  const suggestedActions: string[] = ["Reconcile labor and maintenance legs separately","Benchmark noise/vibration factors with site measurement"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Msa_gage_rr_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
