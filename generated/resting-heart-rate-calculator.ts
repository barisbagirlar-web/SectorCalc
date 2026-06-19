// Auto-generated from resting-heart-rate-calculator-schema.json
import * as z from 'zod';

export interface Resting_heart_rate_calculatorInput {
  beats: number;
  seconds: number;
  age: number;
  fitnessLevel: number;
  dataConfidence?: number;
}

export const Resting_heart_rate_calculatorInputSchema = z.object({
  beats: z.number().default(20),
  seconds: z.number().default(15),
  age: z.number().default(30),
  fitnessLevel: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Resting_heart_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.beats / input.seconds) * 60; results["restingHeartRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["restingHeartRate"] = 0; }
  try { const v = 'Normal resting heart rate ranges from 60 to 100 bpm for adults. Athletes may have 40-60 bpm.'; results["breakdown2Text"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown2Text"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateResting_heart_rate_calculator(input: Resting_heart_rate_calculatorInput): Resting_heart_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["breakdown2Text"]);
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


export interface Resting_heart_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
