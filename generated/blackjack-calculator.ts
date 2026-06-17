// @ts-nocheck
// Auto-generated from blackjack-calculator-schema.json
import * as z from 'zod';

export interface Blackjack_calculatorInput {
  lambdaA: number;
  lambdaB: number;
  lotSize: number;
  costPerBlackjack: number;
}

export const Blackjack_calculatorInputSchema = z.object({
  lambdaA: z.number().default(0.02),
  lambdaB: z.number().default(0.015),
  lotSize: z.number().default(1000),
  costPerBlackjack: z.number().default(500),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Blackjack_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.lambdaA + input.lambdaB + input.lotSize; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.lambdaA + input.lambdaB + input.lotSize; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBlackjack_calculator(input: Blackjack_calculatorInput): Blackjack_calculatorOutput {
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


export interface Blackjack_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
