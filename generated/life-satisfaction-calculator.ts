// Auto-generated from life-satisfaction-calculator-schema.json
import * as z from 'zod';

export interface Life_satisfaction_calculatorInput {
  income: number;
  health: number;
  workLife: number;
  social: number;
  purpose: number;
  dataConfidence?: number;
}

export const Life_satisfaction_calculatorInputSchema = z.object({
  income: z.number().default(7),
  health: z.number().default(8),
  workLife: z.number().default(6),
  social: z.number().default(7),
  purpose: z.number().default(7),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Life_satisfaction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.income * 0.2 + input.health * 0.25 + input.workLife * 0.2 + input.social * 0.2 + input.purpose * 0.15; results["weightedTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightedTotal"] = 0; }
  try { const v = (asFormulaNumber(results["weightedTotal"])) * 10; results["lifeSatisfactionScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lifeSatisfactionScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLife_satisfaction_calculator(input: Life_satisfaction_calculatorInput): Life_satisfaction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["lifeSatisfactionScore"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Life_satisfaction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
