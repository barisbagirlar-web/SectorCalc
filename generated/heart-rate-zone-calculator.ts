// @ts-nocheck
// Auto-generated from heart-rate-zone-calculator-schema.json
import * as z from 'zod';

export interface Heart_rate_zone_calculatorInput {
  age: number;
  restingHeartRate: number;
  lowerIntensity: number;
  upperIntensity: number;
}

export const Heart_rate_zone_calculatorInputSchema = z.object({
  age: z.number().default(30),
  restingHeartRate: z.number().default(60),
  lowerIntensity: z.number().default(60),
  upperIntensity: z.number().default(70),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Heart_rate_zone_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 220 - input.age; results["maxHR"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxHR"] = 0; }
  try { const v = (asFormulaNumber(results["maxHR"])) - input.restingHeartRate; results["heartRateReserve"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["heartRateReserve"] = 0; }
  try { const v = input.restingHeartRate + ((asFormulaNumber(results["heartRateReserve"])) * (input.lowerIntensity / 100)); results["lowerTarget"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["lowerTarget"] = 0; }
  try { const v = input.restingHeartRate + ((asFormulaNumber(results["heartRateReserve"])) * (input.upperIntensity / 100)); results["upperTarget"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["upperTarget"] = 0; }
  try { const v = ((asFormulaNumber(results["lowerTarget"])) + (asFormulaNumber(results["upperTarget"]))) / 2; results["midTarget"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["midTarget"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHeart_rate_zone_calculator(input: Heart_rate_zone_calculatorInput): Heart_rate_zone_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["midTarget"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
