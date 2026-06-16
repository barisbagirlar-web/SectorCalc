// Auto-generated from chi-square-test-of-independence-schema.json
import * as z from 'zod';

export interface Chi_square_test_of_independenceInput {
  observed_11: number;
  observed_12: number;
  observed_21: number;
  observed_22: number;
}

export const Chi_square_test_of_independenceInputSchema = z.object({
  observed_11: z.number().default(10),
  observed_12: z.number().default(20),
  observed_21: z.number().default(30),
  observed_22: z.number().default(40),
});

function evaluateAllFormulas(input: Chi_square_test_of_independenceInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.observed_11 + input.observed_12; results["row1_total"] = Number.isFinite(v) ? v : 0; } catch { results["row1_total"] = 0; }
  try { const v = input.observed_21 + input.observed_22; results["row2_total"] = Number.isFinite(v) ? v : 0; } catch { results["row2_total"] = 0; }
  try { const v = input.observed_11 + input.observed_21; results["col1_total"] = Number.isFinite(v) ? v : 0; } catch { results["col1_total"] = 0; }
  try { const v = input.observed_12 + input.observed_22; results["col2_total"] = Number.isFinite(v) ? v : 0; } catch { results["col2_total"] = 0; }
  try { const v = input.observed_11 + input.observed_12 + input.observed_21 + input.observed_22; results["grand_total"] = Number.isFinite(v) ? v : 0; } catch { results["grand_total"] = 0; }
  try { const v = ((results["row1_total"] ?? 0) * (results["col1_total"] ?? 0)) / (results["grand_total"] ?? 0); results["expected_11"] = Number.isFinite(v) ? v : 0; } catch { results["expected_11"] = 0; }
  try { const v = ((results["row1_total"] ?? 0) * (results["col2_total"] ?? 0)) / (results["grand_total"] ?? 0); results["expected_12"] = Number.isFinite(v) ? v : 0; } catch { results["expected_12"] = 0; }
  try { const v = ((results["row2_total"] ?? 0) * (results["col1_total"] ?? 0)) / (results["grand_total"] ?? 0); results["expected_21"] = Number.isFinite(v) ? v : 0; } catch { results["expected_21"] = 0; }
  try { const v = ((results["row2_total"] ?? 0) * (results["col2_total"] ?? 0)) / (results["grand_total"] ?? 0); results["expected_22"] = Number.isFinite(v) ? v : 0; } catch { results["expected_22"] = 0; }
  try { const v = ((input.observed_11 - (results["expected_11"] ?? 0)) ** 2 / (results["expected_11"] ?? 0)) + ((input.observed_12 - (results["expected_12"] ?? 0)) ** 2 / (results["expected_12"] ?? 0)) + ((input.observed_21 - (results["expected_21"] ?? 0)) ** 2 / (results["expected_21"] ?? 0)) + ((input.observed_22 - (results["expected_22"] ?? 0)) ** 2 / (results["expected_22"] ?? 0)); results["chi_square"] = Number.isFinite(v) ? v : 0; } catch { results["chi_square"] = 0; }
  return results;
}


export function calculateChi_square_test_of_independence(input: Chi_square_test_of_independenceInput): Chi_square_test_of_independenceOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["chi_square"] ?? 0;
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


export interface Chi_square_test_of_independenceOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
