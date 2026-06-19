// Auto-generated from treadmill-incline-calculator-schema.json
import * as z from 'zod';

export interface Treadmill_incline_calculatorInput {
  distance: number;
  inclinePercent: number;
  weight: number;
  speed: number;
  time: number;
  dataConfidence?: number;
}

export const Treadmill_incline_calculatorInputSchema = z.object({
  distance: z.number().default(1),
  inclinePercent: z.number().default(0),
  weight: z.number().default(150),
  speed: z.number().default(3),
  time: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Treadmill_incline_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * 5280 * (input.inclinePercent / 100); results["elevationGain"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["elevationGain"] = 0; }
  try { const v = ( (0.2 * (input.speed * 26.8224) + 0.9 * (input.speed * 26.8224) * (input.inclinePercent / 100) + 3.5) * (input.weight / 2.20462) * input.time * 5 ) / 1000; results["caloriesBurned"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesBurned"] = 0; }
  try { const v = (( (0.2 * (input.speed * 26.8224) + 0.9 * (input.speed * 26.8224) * (input.inclinePercent / 100) + 3.5) * (input.weight / 2.20462) * input.time * 5 ) / 1000) / (((0.2 * (input.speed * 26.8224) + 3.5) * (input.weight / 2.20462) * 5 ) / 1000 * (60 / input.speed)); results["equivalentFlatDistance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["equivalentFlatDistance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTreadmill_incline_calculator(input: Treadmill_incline_calculatorInput): Treadmill_incline_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["elevationGain"]));
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


export interface Treadmill_incline_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
