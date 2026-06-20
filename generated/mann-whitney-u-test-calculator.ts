// Auto-generated from mann-whitney-u-test-calculator-schema.json
import * as z from 'zod';

export interface Mann_whitney_u_test_calculatorInput {
  g1v1: number;
  g1v2: number;
  g1v3: number;
  g2v1: number;
  g2v2: number;
  g2v3: number;
  dataConfidence?: number;
}

export const Mann_whitney_u_test_calculatorInputSchema = z.object({
  g1v1: z.number().default(1),
  g1v2: z.number().default(2),
  g1v3: z.number().default(3),
  g2v1: z.number().default(4),
  g2v2: z.number().default(5),
  g2v3: z.number().default(6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mann_whitney_u_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.g1v1 < input.g2v1 ? 1 : (input.g1v1 === input.g2v1 ? 0.5 : 0)) + (input.g1v1 < input.g2v2 ? 1 : (input.g1v1 === input.g2v2 ? 0.5 : 0)) + (input.g1v1 < input.g2v3 ? 1 : (input.g1v1 === input.g2v3 ? 0.5 : 0)) + (input.g1v2 < input.g2v1 ? 1 : (input.g1v2 === input.g2v1 ? 0.5 : 0)) + (input.g1v2 < input.g2v2 ? 1 : (input.g1v2 === input.g2v2 ? 0.5 : 0)) + (input.g1v2 < input.g2v3 ? 1 : (input.g1v2 === input.g2v3 ? 0.5 : 0)) + (input.g1v3 < input.g2v1 ? 1 : (input.g1v3 === input.g2v1 ? 0.5 : 0)) + (input.g1v3 < input.g2v2 ? 1 : (input.g1v3 === input.g2v2 ? 0.5 : 0)) + (input.g1v3 < input.g2v3 ? 1 : (input.g1v3 === input.g2v3 ? 0.5 : 0))); results["U1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["U1"] = Number.NaN; }
  try { const v = 9 - (toNumericFormulaValue(results["U1"])); results["U2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["U2"] = Number.NaN; }
  return results;
}


export function calculateMann_whitney_u_test_calculator(input: Mann_whitney_u_test_calculatorInput): Mann_whitney_u_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["U2"]);
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


export interface Mann_whitney_u_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
