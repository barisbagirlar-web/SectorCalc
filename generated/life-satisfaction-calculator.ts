// @ts-nocheck
// Auto-generated from life-satisfaction-calculator-schema.json
import * as z from 'zod';

export interface Life_satisfaction_calculatorInput {
  income: number;
  health: number;
  workLife: number;
  social: number;
  purpose: number;
}

export const Life_satisfaction_calculatorInputSchema = z.object({
  income: z.number().default(7),
  health: z.number().default(8),
  workLife: z.number().default(6),
  social: z.number().default(7),
  purpose: z.number().default(7),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Life_satisfaction_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.income * 0.2 + input.health * 0.25 + input.workLife * 0.2 + input.social * 0.2 + input.purpose * 0.15; results["weightedTotal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["weightedTotal"] = 0; }
  try { const v = (asFormulaNumber(results["weightedTotal"])) * 10; results["lifeSatisfactionScore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["lifeSatisfactionScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLife_satisfaction_calculator(input: Life_satisfaction_calculatorInput): Life_satisfaction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["lifeSatisfactionScore"]);
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


export interface Life_satisfaction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
