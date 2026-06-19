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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Max_heart_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentYear - input.birthYear; results["age"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["age"] = 0; }
  try { const v = 220 - (asFormulaNumber(results["age"])); results["maxHR"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maxHR"] = 0; }
  try { const v = (asFormulaNumber(results["maxHR"])) - input.restingHR; results["heartRateReserve"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["heartRateReserve"] = 0; }
  try { const v = input.restingHR + (asFormulaNumber(results["heartRateReserve"])) * (input.lowerIntensity / 100); results["lowerTarget"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lowerTarget"] = 0; }
  try { const v = input.restingHR + (asFormulaNumber(results["heartRateReserve"])) * (input.upperIntensity / 100); results["upperTarget"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["upperTarget"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMax_heart_rate_calculator(input: Max_heart_rate_calculatorInput): Max_heart_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["maxHR"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
