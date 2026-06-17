// @ts-nocheck
// Auto-generated from lactate-threshold-calculator-schema.json
import * as z from 'zod';

export interface Lactate_threshold_calculatorInput {
  age: number;
  restingHeartRate: number;
  maxHeartRate: number;
  intensityFactor: number;
  thirtyMinTrialHeartRate: number;
}

export const Lactate_threshold_calculatorInputSchema = z.object({
  age: z.number().default(30),
  restingHeartRate: z.number().default(60),
  maxHeartRate: z.number().default(0),
  intensityFactor: z.number().default(0.85),
  thirtyMinTrialHeartRate: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lactate_threshold_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.maxHeartRate > 0 ? input.maxHeartRate : 220 - input.age; results["maxHR"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxHR"] = 0; }
  try { const v = (asFormulaNumber(results["maxHR"])) - input.restingHeartRate; results["heartRateReserve"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["heartRateReserve"] = 0; }
  try { const v = input.restingHeartRate + (asFormulaNumber(results["heartRateReserve"])) * input.intensityFactor; results["estimatedLTHR"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["estimatedLTHR"] = 0; }
  try { const v = input.thirtyMinTrialHeartRate > 0 ? input.thirtyMinTrialHeartRate : (asFormulaNumber(results["estimatedLTHR"])); results["lactateThresholdHeartRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["lactateThresholdHeartRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLactate_threshold_calculator(input: Lactate_threshold_calculatorInput): Lactate_threshold_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["lactateThresholdHeartRate"]);
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


export interface Lactate_threshold_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
