// Auto-generated from taguchi-quality-loss-function-calculator-schema.json
import * as z from 'zod';

export interface Taguchi_quality_loss_function_calculatorInput {
  target_value: number;
  lower_spec_limit: number;
  upper_spec_limit: number;
  process_mean: number;
  process_std_dev: number;
  cost_at_limit: number;
  deviation_at_limit: number;
  production_volume: number;
  dataConfidence?: number;
}

export const Taguchi_quality_loss_function_calculatorInputSchema = z.object({
  target_value: z.number().min(0).max(1000).default(10),
  lower_spec_limit: z.number().min(0).max(1000).default(9.5),
  upper_spec_limit: z.number().min(0).max(1000).default(10.5),
  process_mean: z.number().min(0).max(1000).default(10.2),
  process_std_dev: z.number().min(0.001).max(100).default(0.15),
  cost_at_limit: z.number().min(0).max(100000).default(50),
  deviation_at_limit: z.number().min(0.001).max(100).default(0.5),
  production_volume: z.number().min(1).max(100000000).default(10000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Taguchi_quality_loss_function_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.target_value * input.cost_at_limit; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.target_value * input.cost_at_limit; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.target_value * input.cost_at_limit * 1 * (input.lower_spec_limit * input.upper_spec_limit); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.lower_spec_limit; results["factor_lower_spec_limit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_lower_spec_limit"] = 0; }
  try { const v = input.upper_spec_limit; results["factor_upper_spec_limit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_upper_spec_limit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTaguchi_quality_loss_function_calculator(input: Taguchi_quality_loss_function_calculatorInput): Taguchi_quality_loss_function_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-parameter simulation","Custom specification limits"],
  };
}


export interface Taguchi_quality_loss_function_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
