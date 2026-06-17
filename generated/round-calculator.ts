// @ts-nocheck
// Auto-generated from round-calculator-schema.json
import * as z from 'zod';

export interface Round_calculatorInput {
  diameter: number;
  length: number;
  density: number;
  quantity: number;
}

export const Round_calculatorInputSchema = z.object({
  diameter: z.number().default(50),
  length: z.number().default(1000),
  density: z.number().default(7.85),
  quantity: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Round_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 3.141592653589793 * input.diameter**2 * input.length * input.density / 4000000; results["weightPerBar"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["weightPerBar"] = 0; }
  try { const v = 3.141592653589793 * input.diameter**2 * input.length / 4000; results["volumePerBar"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["volumePerBar"] = 0; }
  try { const v = (3.141592653589793 * input.diameter**2 / 2 + 3.141592653589793 * input.diameter * input.length) / 100; results["surfaceAreaPerBar"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["surfaceAreaPerBar"] = 0; }
  try { const v = (3.141592653589793 * input.diameter**2 * input.length * input.density / 4000000) * input.quantity; results["totalWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (3.141592653589793 * input.diameter**2 * input.length / 4000) * input.quantity; results["totalVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = ((3.141592653589793 * input.diameter**2 / 2 + 3.141592653589793 * input.diameter * input.length) / 100) * input.quantity; results["totalSurfaceArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalSurfaceArea"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRound_calculator(input: Round_calculatorInput): Round_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWeight"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
