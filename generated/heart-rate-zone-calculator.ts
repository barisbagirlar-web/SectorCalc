// Auto-generated from heart-rate-zone-calculator-schema.json
import * as z from 'zod';

export interface Heart_rate_zone_calculatorInput {
  age: number;
  restingHeartRate: number;
  lowerIntensity: number;
  upperIntensity: number;
  dataConfidence?: number;
}

export const Heart_rate_zone_calculatorInputSchema = z.object({
  age: z.number().default(30),
  restingHeartRate: z.number().default(60),
  lowerIntensity: z.number().default(60),
  upperIntensity: z.number().default(70),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Heart_rate_zone_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 220 - input.age; results["maxHR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxHR"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["maxHR"])) - input.restingHeartRate; results["heartRateReserve"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heartRateReserve"] = Number.NaN; }
  try { const v = input.restingHeartRate + ((toNumericFormulaValue(results["heartRateReserve"])) * (input.lowerIntensity / 100)); results["lowerTarget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lowerTarget"] = Number.NaN; }
  try { const v = input.restingHeartRate + ((toNumericFormulaValue(results["heartRateReserve"])) * (input.upperIntensity / 100)); results["upperTarget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["upperTarget"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["lowerTarget"])) + (toNumericFormulaValue(results["upperTarget"]))) / 2; results["midTarget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["midTarget"] = Number.NaN; }
  return results;
}


export function calculateHeart_rate_zone_calculator(input: Heart_rate_zone_calculatorInput): Heart_rate_zone_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["midTarget"]);
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


export interface Heart_rate_zone_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
