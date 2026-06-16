// Auto-generated from a-b-test-calculator-schema.json
import * as z from 'zod';

export interface A_b_test_calculatorInput {
  sampleSizeA: number;
  conversionsA: number;
  sampleSizeB: number;
  conversionsB: number;
  confidence: number;
}

export const A_b_test_calculatorInputSchema = z.object({
  sampleSizeA: z.number().default(1000),
  conversionsA: z.number().default(120),
  sampleSizeB: z.number().default(1000),
  conversionsB: z.number().default(100),
  confidence: z.number().default(95),
});

function evaluateAllFormulas(input: A_b_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.conversionsA / input.sampleSizeA; results["pA"] = Number.isFinite(v) ? v : 0; } catch { results["pA"] = 0; }
  try { const v = input.conversionsB / input.sampleSizeB; results["pB"] = Number.isFinite(v) ? v : 0; } catch { results["pB"] = 0; }
  try { const v = (input.conversionsA + input.conversionsB) / (input.sampleSizeA + input.sampleSizeB); results["pPool"] = Number.isFinite(v) ? v : 0; } catch { results["pPool"] = 0; }
  try { const v = Math.sqrt((results["pPool"] ?? 0) * (1 - (results["pPool"] ?? 0)) * (1/input.sampleSizeA + 1/input.sampleSizeB)); results["SE"] = Number.isFinite(v) ? v : 0; } catch { results["SE"] = 0; }
  try { const v = ((results["pA"] ?? 0) - (results["pB"] ?? 0)) / (results["SE"] ?? 0); results["z"] = Number.isFinite(v) ? v : 0; } catch { results["z"] = 0; }
  try { const v = 2 * (1 / (1 + Math.exp(1.8138 * Math.sqrt((results["z"] ?? 0) * (results["z"] ?? 0))))); results["pValue"] = Number.isFinite(v) ? v : 0; } catch { results["pValue"] = 0; }
  try { const v = (results["pValue"] ?? 0) < (1 - input.confidence / 100); results["significant"] = Number.isFinite(v) ? v : 0; } catch { results["significant"] = 0; }
  try { const v = input.conversionsA / input.sampleSizeA; results["conversionRateA"] = Number.isFinite(v) ? v : 0; } catch { results["conversionRateA"] = 0; }
  try { const v = input.conversionsB / input.sampleSizeB; results["conversionRateB"] = Number.isFinite(v) ? v : 0; } catch { results["conversionRateB"] = 0; }
  return results;
}


export function calculateA_b_test_calculator(input: A_b_test_calculatorInput): A_b_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["significant"] ?? 0;
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


export interface A_b_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
