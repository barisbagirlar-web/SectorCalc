// Auto-generated from metric-tons-to-pounds-calculator-schema.json
import * as z from 'zod';

export interface Metric_tons_to_pounds_calculatorInput {
  metric_tons: number;
  number_of_units: number;
  waste_factor: number;
  conversion_factor: number;
  precision: number;
}

export const Metric_tons_to_pounds_calculatorInputSchema = z.object({
  metric_tons: z.number().default(0),
  number_of_units: z.number().default(1),
  waste_factor: z.number().default(0),
  conversion_factor: z.number().default(2204.62262185),
  precision: z.number().default(2),
});

function evaluateAllFormulas(input: Metric_tons_to_pounds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round(input.metric_tons * input.number_of_units * (1 + input.waste_factor / 100) * input.conversion_factor * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["pounds_rounded"] = Number.isFinite(v) ? v : 0; } catch { results["pounds_rounded"] = 0; }
  try { const v = input.metric_tons * input.number_of_units * (1 + input.waste_factor / 100) * input.conversion_factor * 16; results["ounces"] = Number.isFinite(v) ? v : 0; } catch { results["ounces"] = 0; }
  try { const v = input.metric_tons * input.number_of_units * (1 + input.waste_factor / 100) * 1000; results["kilograms"] = Number.isFinite(v) ? v : 0; } catch { results["kilograms"] = 0; }
  return results;
}


export function calculateMetric_tons_to_pounds_calculator(input: Metric_tons_to_pounds_calculatorInput): Metric_tons_to_pounds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pounds_rounded"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Metric_tons_to_pounds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
