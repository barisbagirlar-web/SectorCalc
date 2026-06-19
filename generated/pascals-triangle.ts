// Auto-generated from pascals-triangle-schema.json
import * as z from 'zod';

export interface Pascals_triangleInput {
  rowIndex: number;
  colIndex: number;
  numRows: number;
  maxValue: number;
  dataConfidence?: number;
}

export const Pascals_triangleInputSchema = z.object({
  rowIndex: z.number().default(5),
  colIndex: z.number().default(2),
  numRows: z.number().default(5),
  maxValue: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pascals_triangleInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rowIndex * input.colIndex * input.numRows * input.maxValue; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.rowIndex * input.colIndex * input.numRows * input.maxValue; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePascals_triangle(input: Pascals_triangleInput): Pascals_triangleOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Pascals_triangleOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
