// Auto-generated from heart-rate-calculator-schema.json
import * as z from 'zod';

export interface Heart_rate_calculatorInput {
  age: number;
  restingHR: number;
  intensity: number;
  maxHR: number;
  dataConfidence?: number;
}

export const Heart_rate_calculatorInputSchema = z.object({
  age: z.number().default(30),
  restingHR: z.number().default(70),
  intensity: z.number().default(70),
  maxHR: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Heart_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maxHR > 0 ? input.maxHR : 208 - 0.7 * input.age; results["maxHeartRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxHeartRate"] = Number.NaN; }
  try { const v = (input.maxHR > 0 ? input.maxHR : 208 - 0.7 * input.age) - input.restingHR; results["heartRateReserve"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heartRateReserve"] = Number.NaN; }
  try { const v = ((input.maxHR > 0 ? input.maxHR : 208 - 0.7 * input.age) - input.restingHR) * (input.intensity / 100) + input.restingHR; results["targetHR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["targetHR"] = Number.NaN; }
  return results;
}


export function calculateHeart_rate_calculator(input: Heart_rate_calculatorInput): Heart_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["targetHR"]);
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


export interface Heart_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
