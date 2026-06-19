// Auto-generated from metric-tons-to-pounds-calculator-schema.json
import * as z from 'zod';

export interface Metric_tons_to_pounds_calculatorInput {
  metric_tons: number;
  number_of_units: number;
  waste_factor: number;
  conversion_factor: number;
  precision: number;
  dataConfidence?: number;
}

export const Metric_tons_to_pounds_calculatorInputSchema = z.object({
  metric_tons: z.number().default(0),
  number_of_units: z.number().default(1),
  waste_factor: z.number().default(0),
  conversion_factor: z.number().default(2204.62262185),
  precision: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Metric_tons_to_pounds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.metric_tons * input.number_of_units * (1 + input.waste_factor / 100) * input.conversion_factor * 16; results["ounces"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ounces"] = 0; }
  try { const v = input.metric_tons * input.number_of_units * (1 + input.waste_factor / 100) * 1000; results["kilograms"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["kilograms"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMetric_tons_to_pounds_calculator(input: Metric_tons_to_pounds_calculatorInput): Metric_tons_to_pounds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["kilograms"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
