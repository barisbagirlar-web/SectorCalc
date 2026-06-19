// Auto-generated from fence-stain-calculator-schema.json
import * as z from 'zod';

export interface Fence_stain_calculatorInput {
  fenceLength: number;
  fenceHeight: number;
  picketWidth: number;
  picketSpacing: number;
  coveragePerGallon: number;
  numberOfCoats: number;
  dataConfidence?: number;
}

export const Fence_stain_calculatorInputSchema = z.object({
  fenceLength: z.number().default(10),
  fenceHeight: z.number().default(1.5),
  picketWidth: z.number().default(0.1),
  picketSpacing: z.number().default(0.05),
  coveragePerGallon: z.number().default(5),
  numberOfCoats: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fence_stain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * input.fenceLength * input.fenceHeight * input.picketWidth / (input.picketWidth + input.picketSpacing); results["totalArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  try { const v = (asFormulaNumber(results["totalArea"])) / input.coveragePerGallon; results["stainNeededWithoutCoats"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stainNeededWithoutCoats"] = 0; }
  try { const v = input.fenceLength / (input.picketWidth + input.picketSpacing); results["numberOfPickets"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numberOfPickets"] = 0; }
  try { const v = (asFormulaNumber(results["stainNeededWithoutCoats"])) * input.numberOfCoats; results["totalStain"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalStain"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFence_stain_calculator(input: Fence_stain_calculatorInput): Fence_stain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalStain"]));
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


export interface Fence_stain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
