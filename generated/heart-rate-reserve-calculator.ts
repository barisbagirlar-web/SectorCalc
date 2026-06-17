// @ts-nocheck
// Auto-generated from heart-rate-reserve-calculator-schema.json
import * as z from 'zod';

export interface Heart_rate_reserve_calculatorInput {
  age: number;
  restingHeartRate: number;
  maximumHeartRate: number;
  intensity: number;
}

export const Heart_rate_reserve_calculatorInputSchema = z.object({
  age: z.number().default(30),
  restingHeartRate: z.number().default(70),
  maximumHeartRate: z.number().default(0),
  intensity: z.number().default(60),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Heart_rate_reserve_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.maximumHeartRate > 0 ? input.maximumHeartRate : 220 - input.age; results["maxHeartRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxHeartRate"] = 0; }
  try { const v = (asFormulaNumber(results["maxHeartRate"])) - input.restingHeartRate; results["heartRateReserve"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["heartRateReserve"] = 0; }
  try { const v = (asFormulaNumber(results["heartRateReserve"])) * (input.intensity / 100) + input.restingHeartRate; results["targetHeartRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["targetHeartRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHeart_rate_reserve_calculator(input: Heart_rate_reserve_calculatorInput): Heart_rate_reserve_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["targetHeartRate"]);
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


export interface Heart_rate_reserve_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
