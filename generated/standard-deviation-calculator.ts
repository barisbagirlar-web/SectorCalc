// Auto-generated from standard-deviation-calculator-schema.json
import * as z from 'zod';

export interface Standard_deviation_calculatorInput {
  data_points: number;
  sample_size: number;
  data_type: string;
  population_flag: string;
  unit_of_measure: number;
  specification_limit_lower: number;
  specification_limit_upper: number;
  target_value: number;
  dataConfidence?: number;
}

export const Standard_deviation_calculatorInputSchema = z.object({
  data_points: z.number(),
  sample_size: z.number().min(2).max(10000).default(10),
  data_type: z.enum(['continuous', 'discrete']).default('continuous'),
  population_flag: z.enum(['population', 'sample']).default('sample'),
  unit_of_measure: z.number(),
  specification_limit_lower: z.number(),
  specification_limit_upper: z.number(),
  target_value: z.number(),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Standard_deviation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.data_points * input.sample_size * input.unit_of_measure * input.specification_limit_lower; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.data_points * input.sample_size * input.unit_of_measure * input.specification_limit_lower * (input.specification_limit_upper * input.target_value); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.specification_limit_upper * input.target_value; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStandard_deviation_calculator(input: Standard_deviation_calculatorInput): Standard_deviation_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Historical comparison","Control chart generation"],
  };
}


export interface Standard_deviation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
