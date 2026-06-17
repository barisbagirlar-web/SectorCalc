// @ts-nocheck
// Auto-generated from wedding-cake-serving-calculator-schema.json
import * as z from 'zod';

export interface Wedding_cake_serving_calculatorInput {
  shape: number;
  tier1Diameter: number;
  tier2Diameter: number;
  tier3Diameter: number;
  servingSize: number;
  guestCount: number;
}

export const Wedding_cake_serving_calculatorInputSchema = z.object({
  shape: z.number().default(0),
  tier1Diameter: z.number().default(6),
  tier2Diameter: z.number().default(0),
  tier3Diameter: z.number().default(0),
  servingSize: z.number().default(2),
  guestCount: z.number().default(100),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wedding_cake_serving_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.shape + input.tier1Diameter + input.tier2Diameter; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.shape + input.tier1Diameter + input.tier2Diameter; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWedding_cake_serving_calculator(input: Wedding_cake_serving_calculatorInput): Wedding_cake_serving_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Wedding_cake_serving_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
