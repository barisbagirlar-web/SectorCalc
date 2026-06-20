// Auto-generated from max-heart-rate-calculator-schema.json
import * as z from 'zod';

export interface Max_heart_rate_calculatorInput {
  birthYear: number;
  currentYear: number;
  restingHR: number;
  lowerIntensity: number;
  upperIntensity: number;
  dataConfidence?: number;
}

export const Max_heart_rate_calculatorInputSchema = z.object({
  birthYear: z.number().default(1990),
  currentYear: z.number().default(2024),
  restingHR: z.number().default(70),
  lowerIntensity: z.number().default(60),
  upperIntensity: z.number().default(80),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Max_heart_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentYear - input.birthYear; results["age"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["age"] = Number.NaN; }
  try { const v = 220 - (toNumericFormulaValue(results["age"])); results["maxHR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxHR"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["maxHR"])) - input.restingHR; results["heartRateReserve"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heartRateReserve"] = Number.NaN; }
  try { const v = input.restingHR + (toNumericFormulaValue(results["heartRateReserve"])) * (input.lowerIntensity / 100); results["lowerTarget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lowerTarget"] = Number.NaN; }
  try { const v = input.restingHR + (toNumericFormulaValue(results["heartRateReserve"])) * (input.upperIntensity / 100); results["upperTarget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["upperTarget"] = Number.NaN; }
  return results;
}


export function calculateMax_heart_rate_calculator(input: Max_heart_rate_calculatorInput): Max_heart_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["maxHR"]);
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


export interface Max_heart_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
