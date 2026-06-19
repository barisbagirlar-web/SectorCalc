// Auto-generated from mountaineering-calculator-schema.json
import * as z from 'zod';

export interface Mountaineering_calculatorInput {
  distance: number;
  elevationGain: number;
  flatSpeed: number;
  ascentPace: number;
  difficultyMultiplier: number;
  safetyMarginPercent: number;
  dataConfidence?: number;
}

export const Mountaineering_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  elevationGain: z.number().default(800),
  flatSpeed: z.number().default(5),
  ascentPace: z.number().default(600),
  difficultyMultiplier: z.number().default(1),
  safetyMarginPercent: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mountaineering_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance / input.flatSpeed; results["flatTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["flatTime"] = 0; }
  try { const v = input.elevationGain / input.ascentPace; results["ascentTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ascentTime"] = 0; }
  try { const v = (asFormulaNumber(results["flatTime"])) + (asFormulaNumber(results["ascentTime"])); results["baseTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseTime"] = 0; }
  try { const v = (asFormulaNumber(results["baseTime"])) * input.difficultyMultiplier * (1 + input.safetyMarginPercent / 100); results["totalTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMountaineering_calculator(input: Mountaineering_calculatorInput): Mountaineering_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalTime"]));
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


export interface Mountaineering_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
