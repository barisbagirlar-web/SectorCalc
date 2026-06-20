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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sod_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["area"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["area"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["area"])) * input.wasteFactor / 100; results["wasteArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["area"])) + (toNumericFormulaValue(results["wasteArea"])); results["netArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netArea"] = Number.NaN; }
  return results;
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
