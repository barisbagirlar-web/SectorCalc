// Auto-generated from trail-running-calculator-schema.json
import * as z from 'zod';

export interface Trail_running_calculatorInput {
  distance: number;
  elevation_gain: number;
  elevation_loss: number;
  base_pace: number;
  ascent_factor: number;
  descent_factor: number;
  dataConfidence?: number;
}

export const Trail_running_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  elevation_gain: z.number().default(500),
  elevation_loss: z.number().default(500),
  base_pace: z.number().default(6),
  ascent_factor: z.number().default(0.1),
  descent_factor: z.number().default(0.05),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Trail_running_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * input.base_pace; results["flatTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["flatTime"] = Number.NaN; }
  try { const v = input.elevation_gain * input.ascent_factor; results["ascentTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ascentTime"] = Number.NaN; }
  try { const v = input.elevation_loss * input.descent_factor; results["descentTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["descentTime"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["flatTime"])) + (toNumericFormulaValue(results["ascentTime"])) + (toNumericFormulaValue(results["descentTime"])); results["totalTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTime"] = Number.NaN; }
  return results;
}


export function calculateTrail_running_calculator(input: Trail_running_calculatorInput): Trail_running_calculatorOutput {
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


export interface Trail_running_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
