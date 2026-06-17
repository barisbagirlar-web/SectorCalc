// @ts-nocheck
// Auto-generated from esg-score-calculator-schema.json
import * as z from 'zod';

export interface Esg_score_calculatorInput {
  environScore: number;
  socialScore: number;
  governScore: number;
  weightE: number;
  weightS: number;
  weightG: number;
}

export const Esg_score_calculatorInputSchema = z.object({
  environScore: z.number().default(0),
  socialScore: z.number().default(0),
  governScore: z.number().default(0),
  weightE: z.number().default(0.33),
  weightS: z.number().default(0.33),
  weightG: z.number().default(0.34),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Esg_score_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.weightE + input.weightS + input.weightG; results["totalWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (input.environScore * input.weightE) / (asFormulaNumber(results["totalWeight"])); results["environContrib"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["environContrib"] = 0; }
  try { const v = (input.socialScore * input.weightS) / (asFormulaNumber(results["totalWeight"])); results["socialContrib"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["socialContrib"] = 0; }
  try { const v = (input.governScore * input.weightG) / (asFormulaNumber(results["totalWeight"])); results["governContrib"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["governContrib"] = 0; }
  try { const v = (asFormulaNumber(results["environContrib"])) + (asFormulaNumber(results["socialContrib"])) + (asFormulaNumber(results["governContrib"])); results["esgScore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["esgScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEsg_score_calculator(input: Esg_score_calculatorInput): Esg_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["esgScore"]);
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


export interface Esg_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
