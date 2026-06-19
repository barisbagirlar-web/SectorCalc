// Auto-generated from hiking-time-calculator-schema.json
import * as z from 'zod';

export interface Hiking_time_calculatorInput {
  distance: number;
  elevationGain: number;
  pace: number;
  terrainFactor: number;
  dataConfidence?: number;
}

export const Hiking_time_calculatorInputSchema = z.object({
  distance: z.number().default(5),
  elevationGain: z.number().default(500),
  pace: z.number().default(12),
  terrainFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hiking_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * input.pace * input.terrainFactor + input.elevationGain * 0.1 * input.terrainFactor; results["totalTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTime"] = 0; }
  try { const v = input.distance * input.pace * input.terrainFactor; results["walkingTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["walkingTime"] = 0; }
  try { const v = input.elevationGain * 0.1 * input.terrainFactor; results["elevationTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["elevationTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHiking_time_calculator(input: Hiking_time_calculatorInput): Hiking_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTime"]);
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


export interface Hiking_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
