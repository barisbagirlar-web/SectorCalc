// Auto-generated from blackjack-calculator-schema.json
import * as z from 'zod';

export interface Blackjack_calculatorInput {
  lambdaA: number;
  lambdaB: number;
  lotSize: number;
  costPerBlackjack: number;
  dataConfidence?: number;
}

export const Blackjack_calculatorInputSchema = z.object({
  lambdaA: z.number().default(0.02),
  lambdaB: z.number().default(0.015),
  lotSize: z.number().default(1000),
  costPerBlackjack: z.number().default(500),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Blackjack_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lambdaA * input.costPerBlackjack; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.lambdaA * input.costPerBlackjack; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.lambdaA * input.costPerBlackjack; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBlackjack_calculator(input: Blackjack_calculatorInput): Blackjack_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
