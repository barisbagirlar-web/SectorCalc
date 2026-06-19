// Auto-generated from alpha-beta-calculator-schema.json
import * as z from 'zod';

export interface Alpha_beta_calculatorInput {
  stockReturn: number;
  marketReturn: number;
  riskFreeRate: number;
  covSM: number;
  varM: number;
  dataConfidence?: number;
}

export const Alpha_beta_calculatorInputSchema = z.object({
  stockReturn: z.number().default(12),
  marketReturn: z.number().default(10),
  riskFreeRate: z.number().default(3),
  covSM: z.number().default(0.015),
  varM: z.number().default(0.01),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Alpha_beta_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.covSM / input.varM; results["beta"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["beta"] = 0; }
  try { const v = (input.stockReturn - input.riskFreeRate) / (input.marketReturn - input.riskFreeRate); results["beta_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["beta_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAlpha_beta_calculator(input: Alpha_beta_calculatorInput): Alpha_beta_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["beta_aux"]));
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


export interface Alpha_beta_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
