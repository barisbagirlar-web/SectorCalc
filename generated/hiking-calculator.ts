// Auto-generated from hiking-calculator-schema.json
import * as z from 'zod';

export interface Hiking_calculatorInput {
  distance: number;
  elevationGain: number;
  averageSpeed: number;
  backpackWeight: number;
  dataConfidence?: number;
}

export const Hiking_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  elevationGain: z.number().default(500),
  averageSpeed: z.number().default(5),
  backpackWeight: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hiking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.averageSpeed * (1 - 0.005 * input.backpackWeight); results["adjustedSpeed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustedSpeed"] = Number.NaN; }
  try { const v = input.distance / (toNumericFormulaValue(results["adjustedSpeed"])); results["baseTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseTime"] = Number.NaN; }
  try { const v = input.elevationGain / 600; results["ascentTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ascentTime"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseTime"])) + (toNumericFormulaValue(results["ascentTime"])); results["totalTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTime"] = Number.NaN; }
  return results;
}


export function calculateHiking_calculator(input: Hiking_calculatorInput): Hiking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedSpeed"]);
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


export interface Hiking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
