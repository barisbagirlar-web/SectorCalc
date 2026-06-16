// Auto-generated from triple-test-calculator-schema.json
import * as z from 'zod';

export interface Triple_test_calculatorInput {
  s1: number;
  s2: number;
  s3: number;
  target: number;
  cv_limit: number;
  min_individual: number;
  max_individual: number;
}

export const Triple_test_calculatorInputSchema = z.object({
  s1: z.number().default(30),
  s2: z.number().default(32),
  s3: z.number().default(31),
  target: z.number().default(30),
  cv_limit: z.number().default(10),
  min_individual: z.number().default(25),
  max_individual: z.number().default(45),
});

function evaluateAllFormulas(input: Triple_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.s1 + input.s2 + input.s3) / 3; results["mean"] = Number.isFinite(v) ? v : 0; } catch { results["mean"] = 0; }
  try { const v = Math.sqrt((Math.pow(input.s1 - (input.s1 + input.s2 + input.s3) / 3, 2) + Math.pow(input.s2 - (input.s1 + input.s2 + input.s3) / 3, 2) + Math.pow(input.s3 - (input.s1 + input.s2 + input.s3) / 3, 2)) / 3); results["std_dev"] = Number.isFinite(v) ? v : 0; } catch { results["std_dev"] = 0; }
  results["cv"] = 0;
  try { const v = ((input.s1 + input.s2 + input.s3) / 3) >= input.target; results["mean_ok"] = Number.isFinite(v) ? v : 0; } catch { results["mean_ok"] = 0; }
  results["cv_ok"] = 0;
  try { const v = input.s1 >= input.min_individual && input.s2 >= input.min_individual && input.s3 >= input.min_individual; results["min_ok"] = Number.isFinite(v) ? v : 0; } catch { results["min_ok"] = 0; }
  try { const v = input.s1 <= input.max_individual && input.s2 <= input.max_individual && input.s3 <= input.max_individual; results["max_ok"] = Number.isFinite(v) ? v : 0; } catch { results["max_ok"] = 0; }
  results["acceptance"] = 0;
  return results;
}


export function calculateTriple_test_calculator(input: Triple_test_calculatorInput): Triple_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["acceptance"] ?? 0;
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


export interface Triple_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
