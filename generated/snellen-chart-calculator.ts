// Auto-generated from snellen-chart-calculator-schema.json
import * as z from 'zod';

export interface Snellen_chart_calculatorInput {
  testDistance: number;
  optotypeHeight: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Snellen_chart_calculatorInputSchema = z.object({
  testDistance: z.number().default(6),
  optotypeHeight: z.number().default(8.73),
  auto_input_3: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Snellen_chart_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.testDistance * input.optotypeHeight * input.auto_input_3; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.testDistance * input.optotypeHeight * input.auto_input_3; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSnellen_chart_calculator(input: Snellen_chart_calculatorInput): Snellen_chart_calculatorOutput {
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
    premiumFeatures: [],
  };
}


export interface Snellen_chart_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
