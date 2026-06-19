// Auto-generated from wood-siding-calculator-schema.json
import * as z from 'zod';

export interface Wood_siding_calculatorInput {
  wallWidth: number;
  wallHeight: number;
  exposedFace: number;
  boardLength: number;
  wasteFactor: number;
  pricePerBoard: number;
  dataConfidence?: number;
}

export const Wood_siding_calculatorInputSchema = z.object({
  wallWidth: z.number().default(20),
  wallHeight: z.number().default(10),
  exposedFace: z.number().default(4),
  boardLength: z.number().default(12),
  wasteFactor: z.number().default(10),
  pricePerBoard: z.number().default(8.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wood_siding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallWidth * input.wallHeight; results["wallArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wallArea"] = 0; }
  try { const v = input.wallWidth * input.wallHeight; results["wallArea_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wallArea_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWood_siding_calculator(input: Wood_siding_calculatorInput): Wood_siding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["wallArea_aux"]);
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


export interface Wood_siding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
