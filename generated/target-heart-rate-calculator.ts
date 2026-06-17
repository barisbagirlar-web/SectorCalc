// @ts-nocheck
// Auto-generated from target-heart-rate-calculator-schema.json
import * as z from 'zod';

export interface Target_heart_rate_calculatorInput {
  age: number;
  restingHeartRate: number;
  intensityMin: number;
  intensityMax: number;
}

export const Target_heart_rate_calculatorInputSchema = z.object({
  age: z.number().default(30),
  restingHeartRate: z.number().default(70),
  intensityMin: z.number().default(50),
  intensityMax: z.number().default(85),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Target_heart_rate_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 220 - input.age; results["maxHeartRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxHeartRate"] = 0; }
  try { const v = (asFormulaNumber(results["maxHeartRate"])) - input.restingHeartRate; results["heartRateReserve"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["heartRateReserve"] = 0; }
  try { const v = (asFormulaNumber(results["heartRateReserve"])) * (input.intensityMin / 100) + input.restingHeartRate; results["targetMin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["targetMin"] = 0; }
  try { const v = (asFormulaNumber(results["heartRateReserve"])) * (input.intensityMax / 100) + input.restingHeartRate; results["targetMax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["targetMax"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTarget_heart_rate_calculator(input: Target_heart_rate_calculatorInput): Target_heart_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["maxHeartRate"]);
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


export interface Target_heart_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
