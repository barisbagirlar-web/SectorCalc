// Auto-generated from lactate-threshold-calculator-schema.json
import * as z from 'zod';

export interface Lactate_threshold_calculatorInput {
  age: number;
  restingHeartRate: number;
  maxHeartRate: number;
  intensityFactor: number;
  thirtyMinTrialHeartRate: number;
  dataConfidence?: number;
}

export const Lactate_threshold_calculatorInputSchema = z.object({
  age: z.number().default(30),
  restingHeartRate: z.number().default(60),
  maxHeartRate: z.number().default(0),
  intensityFactor: z.number().default(0.85),
  thirtyMinTrialHeartRate: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lactate_threshold_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maxHeartRate > 0 ? input.maxHeartRate : 220 - input.age; results["maxHR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxHR"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["maxHR"])) - input.restingHeartRate; results["heartRateReserve"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heartRateReserve"] = Number.NaN; }
  try { const v = input.restingHeartRate + (toNumericFormulaValue(results["heartRateReserve"])) * input.intensityFactor; results["estimatedLTHR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["estimatedLTHR"] = Number.NaN; }
  try { const v = input.thirtyMinTrialHeartRate > 0 ? input.thirtyMinTrialHeartRate : (toNumericFormulaValue(results["estimatedLTHR"])); results["lactateThresholdHeartRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lactateThresholdHeartRate"] = Number.NaN; }
  return results;
}


export function calculateLactate_threshold_calculator(input: Lactate_threshold_calculatorInput): Lactate_threshold_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["lactateThresholdHeartRate"]);
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


export interface Lactate_threshold_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
