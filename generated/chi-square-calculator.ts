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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Chi_square_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cell11 + input.cell12 + input.cell21 + input.cell22; results["total"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  try { const v = input.cell11 + input.cell12; results["row1Total"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["row1Total"] = 0; }
  try { const v = input.cell21 + input.cell22; results["row2Total"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["row2Total"] = 0; }
  try { const v = input.cell11 + input.cell21; results["col1Total"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["col1Total"] = 0; }
  try { const v = input.cell12 + input.cell22; results["col2Total"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["col2Total"] = 0; }
  try { const v = ((asFormulaNumber(results["row1Total"])) * (asFormulaNumber(results["col1Total"]))) / (asFormulaNumber(results["total"])); results["expected11"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expected11"] = 0; }
  try { const v = ((asFormulaNumber(results["row1Total"])) * (asFormulaNumber(results["col2Total"]))) / (asFormulaNumber(results["total"])); results["expected12"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expected12"] = 0; }
  try { const v = ((asFormulaNumber(results["row2Total"])) * (asFormulaNumber(results["col1Total"]))) / (asFormulaNumber(results["total"])); results["expected21"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expected21"] = 0; }
  try { const v = ((asFormulaNumber(results["row2Total"])) * (asFormulaNumber(results["col2Total"]))) / (asFormulaNumber(results["total"])); results["expected22"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expected22"] = 0; }
  try { const v = (input.cell11 - (asFormulaNumber(results["expected11"]))) ** 2 / (asFormulaNumber(results["expected11"])); results["chiSq11"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["chiSq11"] = 0; }
  try { const v = (input.cell12 - (asFormulaNumber(results["expected12"]))) ** 2 / (asFormulaNumber(results["expected12"])); results["chiSq12"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["chiSq12"] = 0; }
  try { const v = (input.cell21 - (asFormulaNumber(results["expected21"]))) ** 2 / (asFormulaNumber(results["expected21"])); results["chiSq21"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["chiSq21"] = 0; }
  try { const v = (input.cell22 - (asFormulaNumber(results["expected22"]))) ** 2 / (asFormulaNumber(results["expected22"])); results["chiSq22"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["chiSq22"] = 0; }
  try { const v = (asFormulaNumber(results["chiSq11"])) + (asFormulaNumber(results["chiSq12"])) + (asFormulaNumber(results["chiSq21"])) + (asFormulaNumber(results["chiSq22"])); results["chiSquare"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["chiSquare"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateChi_square_calculator(input: Chi_square_calculatorInput): Chi_square_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["chiSquare"]));
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


export interface Chi_square_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
