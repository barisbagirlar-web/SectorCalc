// Auto-generated from stain-calculator-schema.json
import * as z from 'zod';

export interface Stain_calculatorInput {
  surfaceArea: number;
  stainIntensity: number;
  coverageRate: number;
  efficiency: number;
  numberOfCoats: number;
  dataConfidence?: number;
}

export const Stain_calculatorInputSchema = z.object({
  surfaceArea: z.number().default(10),
  stainIntensity: z.number().default(50),
  coverageRate: z.number().default(10),
  efficiency: z.number().default(80),
  numberOfCoats: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.surfaceArea; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.surfaceArea; results["result_copy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStain_calculator(input: Stain_calculatorInput): Stain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Stain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
