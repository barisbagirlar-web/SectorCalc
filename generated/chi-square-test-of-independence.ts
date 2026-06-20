// Auto-generated from chi-square-test-of-independence-schema.json
import * as z from 'zod';

export interface Chi_square_test_of_independenceInput {
  observed_11: number;
  observed_12: number;
  observed_21: number;
  observed_22: number;
  dataConfidence?: number;
}

export const Chi_square_test_of_independenceInputSchema = z.object({
  observed_11: z.number().default(10),
  observed_12: z.number().default(20),
  observed_21: z.number().default(30),
  observed_22: z.number().default(40),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Chi_square_test_of_independenceInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.observed_11 + input.observed_12; results["row1_total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["row1_total"] = Number.NaN; }
  try { const v = input.observed_21 + input.observed_22; results["row2_total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["row2_total"] = Number.NaN; }
  try { const v = input.observed_11 + input.observed_21; results["col1_total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["col1_total"] = Number.NaN; }
  try { const v = input.observed_12 + input.observed_22; results["col2_total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["col2_total"] = Number.NaN; }
  try { const v = input.observed_11 + input.observed_12 + input.observed_21 + input.observed_22; results["grand_total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grand_total"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["row1_total"])) * (toNumericFormulaValue(results["col1_total"]))) / (toNumericFormulaValue(results["grand_total"])); results["expected_11"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expected_11"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["row1_total"])) * (toNumericFormulaValue(results["col2_total"]))) / (toNumericFormulaValue(results["grand_total"])); results["expected_12"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expected_12"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["row2_total"])) * (toNumericFormulaValue(results["col1_total"]))) / (toNumericFormulaValue(results["grand_total"])); results["expected_21"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expected_21"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["row2_total"])) * (toNumericFormulaValue(results["col2_total"]))) / (toNumericFormulaValue(results["grand_total"])); results["expected_22"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expected_22"] = Number.NaN; }
  try { const v = ((input.observed_11 - (toNumericFormulaValue(results["expected_11"]))) ** 2 / (toNumericFormulaValue(results["expected_11"]))) + ((input.observed_12 - (toNumericFormulaValue(results["expected_12"]))) ** 2 / (toNumericFormulaValue(results["expected_12"]))) + ((input.observed_21 - (toNumericFormulaValue(results["expected_21"]))) ** 2 / (toNumericFormulaValue(results["expected_21"]))) + ((input.observed_22 - (toNumericFormulaValue(results["expected_22"]))) ** 2 / (toNumericFormulaValue(results["expected_22"]))); results["chi_square"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["chi_square"] = Number.NaN; }
  return results;
}


export function calculateChi_square_test_of_independence(input: Chi_square_test_of_independenceInput): Chi_square_test_of_independenceOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["chi_square"]);
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


export interface Chi_square_test_of_independenceOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
