// Auto-generated from golf-distance-calculator-schema.json
import * as z from 'zod';

export interface Golf_distance_calculatorInput {
  clubSpeed: number;
  smashFactor: number;
  launchAngle: number;
  spinRate: number;
  windSpeed: number;
  altitude: number;
  dataConfidence?: number;
}

export const Golf_distance_calculatorInputSchema = z.object({
  clubSpeed: z.number().default(100),
  smashFactor: z.number().default(1.48),
  launchAngle: z.number().default(12),
  spinRate: z.number().default(2500),
  windSpeed: z.number().default(0),
  altitude: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Golf_distance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.clubSpeed * input.smashFactor; results["ballSpeed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ballSpeed"] = 0; }
  try { const v = ((asFormulaNumber(results["ballSpeed"])) * 1.75) - 40 + (input.launchAngle - 12) * 3 - (input.spinRate - 2500) * 0.03 + (input.windSpeed * 2) + (input.altitude * 0.001); results["carryDistance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["carryDistance"] = 0; }
  try { const v = (asFormulaNumber(results["carryDistance"])) * 1.08; results["totalDistance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDistance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGolf_distance_calculator(input: Golf_distance_calculatorInput): Golf_distance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalDistance"]));
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


export interface Golf_distance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
