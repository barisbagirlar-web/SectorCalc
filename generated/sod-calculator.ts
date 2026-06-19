// Auto-generated from sod-calculator-schema.json
import * as z from 'zod';

export interface Sod_calculatorInput {
  length: number;
  width: number;
  wasteFactor: number;
  rollCoverage: number;
  pricePerRoll: number;
  dataConfidence?: number;
}

export const Sod_calculatorInputSchema = z.object({
  length: z.number().default(0),
  width: z.number().default(0),
  wasteFactor: z.number().default(5),
  rollCoverage: z.number().default(10),
  pricePerRoll: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sod_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["area"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  try { const v = (asFormulaNumber(results["area"])) * input.wasteFactor / 100; results["wasteArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteArea"] = 0; }
  try { const v = (asFormulaNumber(results["area"])) + (asFormulaNumber(results["wasteArea"])); results["netArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netArea"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSod_calculator(input: Sod_calculatorInput): Sod_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netArea"]);
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


export interface Sod_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
