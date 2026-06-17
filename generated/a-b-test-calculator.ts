// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: A_b_test_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.conversionsA / input.sampleSizeA; results["pA"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pA"] = 0; }
  try { const v = input.conversionsB / input.sampleSizeB; results["pB"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pB"] = 0; }
  try { const v = (input.conversionsA + input.conversionsB) / (input.sampleSizeA + input.sampleSizeB); results["pPool"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pPool"] = 0; }
  try { const v = input.conversionsA / input.sampleSizeA; results["conversionRateA"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["conversionRateA"] = 0; }
  try { const v = input.conversionsB / input.sampleSizeB; results["conversionRateB"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["conversionRateB"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateA_b_test_calculator(input: A_b_test_calculatorInput): A_b_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["conversionRateB"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
