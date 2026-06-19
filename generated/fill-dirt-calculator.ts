// Auto-generated from fill-dirt-calculator-schema.json
import * as z from 'zod';

export interface Fill_dirt_calculatorInput {
  length: number;
  width: number;
  depth: number;
  compactionFactor: number;
  dataConfidence?: number;
}

export const Fill_dirt_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(5),
  depth: z.number().default(0.5),
  compactionFactor: z.number().default(1.2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fill_dirt_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * input.depth; results["compactVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["compactVolume"] = 0; }
  try { const v = (asFormulaNumber(results["compactVolume"])) * input.compactionFactor; results["looseVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["looseVolume"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFill_dirt_calculator(input: Fill_dirt_calculatorInput): Fill_dirt_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["looseVolume"]));
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


export interface Fill_dirt_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
