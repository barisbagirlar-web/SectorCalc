// Auto-generated from chi-square-calculator-schema.json
import * as z from 'zod';

export interface Chi_square_calculatorInput {
  cell11: number;
  cell12: number;
  cell21: number;
  cell22: number;
  dataConfidence?: number;
}

export const Chi_square_calculatorInputSchema = z.object({
  cell11: z.number().default(0),
  cell12: z.number().default(0),
  cell21: z.number().default(0),
  cell22: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Chi_square_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cell11 + input.cell12 + input.cell21 + input.cell22; results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  try { const v = input.cell11 + input.cell12; results["row1Total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["row1Total"] = Number.NaN; }
  try { const v = input.cell21 + input.cell22; results["row2Total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["row2Total"] = Number.NaN; }
  try { const v = input.cell11 + input.cell21; results["col1Total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["col1Total"] = Number.NaN; }
  try { const v = input.cell12 + input.cell22; results["col2Total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["col2Total"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["row1Total"])) * (toNumericFormulaValue(results["col1Total"]))) / (toNumericFormulaValue(results["total"])); results["expected11"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expected11"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["row1Total"])) * (toNumericFormulaValue(results["col2Total"]))) / (toNumericFormulaValue(results["total"])); results["expected12"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expected12"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["row2Total"])) * (toNumericFormulaValue(results["col1Total"]))) / (toNumericFormulaValue(results["total"])); results["expected21"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expected21"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["row2Total"])) * (toNumericFormulaValue(results["col2Total"]))) / (toNumericFormulaValue(results["total"])); results["expected22"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expected22"] = Number.NaN; }
  try { const v = (input.cell11 - (toNumericFormulaValue(results["expected11"]))) ** 2 / (toNumericFormulaValue(results["expected11"])); results["chiSq11"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["chiSq11"] = Number.NaN; }
  try { const v = (input.cell12 - (toNumericFormulaValue(results["expected12"]))) ** 2 / (toNumericFormulaValue(results["expected12"])); results["chiSq12"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["chiSq12"] = Number.NaN; }
  try { const v = (input.cell21 - (toNumericFormulaValue(results["expected21"]))) ** 2 / (toNumericFormulaValue(results["expected21"])); results["chiSq21"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["chiSq21"] = Number.NaN; }
  try { const v = (input.cell22 - (toNumericFormulaValue(results["expected22"]))) ** 2 / (toNumericFormulaValue(results["expected22"])); results["chiSq22"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["chiSq22"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["chiSq11"])) + (toNumericFormulaValue(results["chiSq12"])) + (toNumericFormulaValue(results["chiSq21"])) + (toNumericFormulaValue(results["chiSq22"])); results["chiSquare"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["chiSquare"] = Number.NaN; }
  return results;
}


export function calculateChi_square_calculator(input: Chi_square_calculatorInput): Chi_square_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["chiSquare"]);
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


export interface Chi_square_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
