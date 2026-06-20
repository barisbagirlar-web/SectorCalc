// Auto-generated from round-calculator-schema.json
import * as z from 'zod';

export interface Round_calculatorInput {
  diameter: number;
  length: number;
  density: number;
  quantity: number;
  dataConfidence?: number;
}

export const Round_calculatorInputSchema = z.object({
  diameter: z.number().default(50),
  length: z.number().default(1000),
  density: z.number().default(7.85),
  quantity: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Round_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 3.141592653589793 * input.diameter**2 * input.length * input.density / 4000000; results["weightPerBar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightPerBar"] = Number.NaN; }
  try { const v = 3.141592653589793 * input.diameter**2 * input.length / 4000; results["volumePerBar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumePerBar"] = Number.NaN; }
  try { const v = (3.141592653589793 * input.diameter**2 / 2 + 3.141592653589793 * input.diameter * input.length) / 100; results["surfaceAreaPerBar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["surfaceAreaPerBar"] = Number.NaN; }
  try { const v = (3.141592653589793 * input.diameter**2 * input.length * input.density / 4000000) * input.quantity; results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeight"] = Number.NaN; }
  try { const v = (3.141592653589793 * input.diameter**2 * input.length / 4000) * input.quantity; results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalVolume"] = Number.NaN; }
  try { const v = ((3.141592653589793 * input.diameter**2 / 2 + 3.141592653589793 * input.diameter * input.length) / 100) * input.quantity; results["totalSurfaceArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSurfaceArea"] = Number.NaN; }
  return results;
}


export function calculateRound_calculator(input: Round_calculatorInput): Round_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWeight"]);
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


export interface Round_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
