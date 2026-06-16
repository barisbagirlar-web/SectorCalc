// Auto-generated from shapiro-wilk-test-calculator-schema.json
import * as z from 'zod';

export interface Shapiro_wilk_test_calculatorInput {
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  x5: number;
}

export const Shapiro_wilk_test_calculatorInputSchema = z.object({
  x1: z.number().default(0),
  x2: z.number().default(0),
  x3: z.number().default(0),
  x4: z.number().default(0),
  x5: z.number().default(0),
});

function evaluateAllFormulas(input: Shapiro_wilk_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.x1 + input.x2 + input.x3 + input.x4 + input.x5) / 5; results["mean"] = Number.isFinite(v) ? v : 0; } catch { results["mean"] = 0; }
  try { const v = Math.pow(input.x1 - (results["mean"] ?? 0), 2) + Math.pow(input.x2 - (results["mean"] ?? 0), 2) + Math.pow(input.x3 - (results["mean"] ?? 0), 2) + Math.pow(input.x4 - (results["mean"] ?? 0), 2) + Math.pow(input.x5 - (results["mean"] ?? 0), 2); results["SS"] = Number.isFinite(v) ? v : 0; } catch { results["SS"] = 0; }
  try { const v = -0.5739*input.x1 - 0.3291*input.x2 + 0*input.x3 + 0.3291*input.x4 + 0.5739*input.x5; results["sum_ax"] = Number.isFinite(v) ? v : 0; } catch { results["sum_ax"] = 0; }
  try { const v = Math.pow((results["sum_ax"] ?? 0), 2) / (results["SS"] ?? 0); results["W"] = Number.isFinite(v) ? v : 0; } catch { results["W"] = 0; }
  return results;
}


export function calculateShapiro_wilk_test_calculator(input: Shapiro_wilk_test_calculatorInput): Shapiro_wilk_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["shapiroWilkStat"] ?? 0;
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


export interface Shapiro_wilk_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
