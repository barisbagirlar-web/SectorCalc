// Auto-generated from spc-limit-calculator-schema.json
import * as z from 'zod';

export interface Spc_limit_calculatorInput {
  subgroup_size: number;
  num_subgroups: number;
  overall_mean: number;
  average_range: number;
  usl: number;
  lsl: number;
  chart_type: string;
  use_estimated_sigma: boolean;
  dataConfidence?: number;
}

export const Spc_limit_calculatorInputSchema = z.object({
  subgroup_size: z.number().min(2).max(25).default(5),
  num_subgroups: z.number().min(10).max(100).default(20),
  overall_mean: z.number().min(0).max(1000).default(50),
  average_range: z.number().min(0.1).max(100).default(5),
  usl: z.number().min(0).max(1000).default(60),
  lsl: z.number().min(0).max(1000).default(40),
  chart_type: z.enum(['Xbar-R', 'Xbar-s', 'I-MR']).default('Xbar-R'),
  use_estimated_sigma: z.boolean().default(true),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Spc_limit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.subgroup_size * input.num_subgroups * input.overall_mean * input.average_range; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.subgroup_size * input.num_subgroups * input.overall_mean * input.average_range * (input.usl * input.lsl); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.usl * input.lsl; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateSpc_limit_calculator(input: Spc_limit_calculatorInput): Spc_limit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time data streaming","Multi-plant comparison"],
  };
}


export interface Spc_limit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
