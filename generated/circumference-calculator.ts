// Auto-generated from circumference-calculator-schema.json
import * as z from 'zod';

export interface Circumference_calculatorInput {
  radius: number;
  diameter: number;
  area: number;
  conversionFactor: number;
  decimalPlaces: number;
  dataConfidence?: number;
}

export const Circumference_calculatorInputSchema = z.object({
  radius: z.number().default(0),
  diameter: z.number().default(0),
  area: z.number().default(0),
  conversionFactor: z.number().default(1),
  decimalPlaces: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Circumference_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.radius * input.diameter * input.area * input.conversionFactor; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.radius * input.diameter * input.area * input.conversionFactor * (input.decimalPlaces); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.decimalPlaces; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateCircumference_calculator(input: Circumference_calculatorInput): Circumference_calculatorOutput {
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


export interface Circumference_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
