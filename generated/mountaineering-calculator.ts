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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mountaineering_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance / input.flatSpeed; results["flatTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["flatTime"] = Number.NaN; }
  try { const v = input.elevationGain / input.ascentPace; results["ascentTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ascentTime"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["flatTime"])) + (toNumericFormulaValue(results["ascentTime"])); results["baseTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseTime"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseTime"])) * input.difficultyMultiplier * (1 + input.safetyMarginPercent / 100); results["totalTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTime"] = Number.NaN; }
  return results;
}


export function calculateMountaineering_calculator(input: Mountaineering_calculatorInput): Mountaineering_calculatorOutput {
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


export interface Mountaineering_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
