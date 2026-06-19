// Auto-generated from vinyl-flooring-calculator-schema.json
import * as z from 'zod';

export interface Vinyl_flooring_calculatorInput {
  roomLength: number;
  roomWidth: number;
  plankLength: number;
  plankWidth: number;
  wasteFactor: number;
  plankPrice: number;
  dataConfidence?: number;
}

export const Vinyl_flooring_calculatorInputSchema = z.object({
  roomLength: z.number().default(5),
  roomWidth: z.number().default(4),
  plankLength: z.number().default(1.2),
  plankWidth: z.number().default(0.2),
  wasteFactor: z.number().default(10),
  plankPrice: z.number().default(15),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vinyl_flooring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roomLength * input.roomWidth; results["totalArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  try { const v = (asFormulaNumber(results["totalArea"])) * (1 + input.wasteFactor / 100); results["effectiveArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveArea"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveArea"])) / (input.plankLength * input.plankWidth); results["numberOfPlanks"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numberOfPlanks"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveArea"])) * input.plankPrice; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVinyl_flooring_calculator(input: Vinyl_flooring_calculatorInput): Vinyl_flooring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Vinyl_flooring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
