// Auto-generated from chi-square-calculator-schema.json
import * as z from 'zod';

export interface Chi_square_calculatorInput {
  cell11: number;
  cell12: number;
  cell21: number;
  cell22: number;
}

export const Chi_square_calculatorInputSchema = z.object({
  cell11: z.number().default(0),
  cell12: z.number().default(0),
  cell21: z.number().default(0),
  cell22: z.number().default(0),
});

function evaluateAllFormulas(input: Chi_square_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cell11 + input.cell12 + input.cell21 + input.cell22; results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  try { const v = input.cell11 + input.cell12; results["row1Total"] = Number.isFinite(v) ? v : 0; } catch { results["row1Total"] = 0; }
  try { const v = input.cell21 + input.cell22; results["row2Total"] = Number.isFinite(v) ? v : 0; } catch { results["row2Total"] = 0; }
  try { const v = input.cell11 + input.cell21; results["col1Total"] = Number.isFinite(v) ? v : 0; } catch { results["col1Total"] = 0; }
  try { const v = input.cell12 + input.cell22; results["col2Total"] = Number.isFinite(v) ? v : 0; } catch { results["col2Total"] = 0; }
  try { const v = ((results["row1Total"] ?? 0) * (results["col1Total"] ?? 0)) / (results["total"] ?? 0); results["expected11"] = Number.isFinite(v) ? v : 0; } catch { results["expected11"] = 0; }
  try { const v = ((results["row1Total"] ?? 0) * (results["col2Total"] ?? 0)) / (results["total"] ?? 0); results["expected12"] = Number.isFinite(v) ? v : 0; } catch { results["expected12"] = 0; }
  try { const v = ((results["row2Total"] ?? 0) * (results["col1Total"] ?? 0)) / (results["total"] ?? 0); results["expected21"] = Number.isFinite(v) ? v : 0; } catch { results["expected21"] = 0; }
  try { const v = ((results["row2Total"] ?? 0) * (results["col2Total"] ?? 0)) / (results["total"] ?? 0); results["expected22"] = Number.isFinite(v) ? v : 0; } catch { results["expected22"] = 0; }
  try { const v = (input.cell11 - (results["expected11"] ?? 0)) ** 2 / (results["expected11"] ?? 0); results["chiSq11"] = Number.isFinite(v) ? v : 0; } catch { results["chiSq11"] = 0; }
  try { const v = (input.cell12 - (results["expected12"] ?? 0)) ** 2 / (results["expected12"] ?? 0); results["chiSq12"] = Number.isFinite(v) ? v : 0; } catch { results["chiSq12"] = 0; }
  try { const v = (input.cell21 - (results["expected21"] ?? 0)) ** 2 / (results["expected21"] ?? 0); results["chiSq21"] = Number.isFinite(v) ? v : 0; } catch { results["chiSq21"] = 0; }
  try { const v = (input.cell22 - (results["expected22"] ?? 0)) ** 2 / (results["expected22"] ?? 0); results["chiSq22"] = Number.isFinite(v) ? v : 0; } catch { results["chiSq22"] = 0; }
  try { const v = (results["chiSq11"] ?? 0) + (results["chiSq12"] ?? 0) + (results["chiSq21"] ?? 0) + (results["chiSq22"] ?? 0); results["chiSquare"] = Number.isFinite(v) ? v : 0; } catch { results["chiSquare"] = 0; }
  return results;
}


export function calculateChi_square_calculator(input: Chi_square_calculatorInput): Chi_square_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["chiSquare"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
