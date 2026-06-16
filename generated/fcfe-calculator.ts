// Auto-generated from fcfe-calculator-schema.json
import * as z from 'zod';

export interface Fcfe_calculatorInput {
  netIncome: number;
  capex: number;
  depreciation: number;
  changeWC: number;
  newDebt: number;
  repayments: number;
}

export const Fcfe_calculatorInputSchema = z.object({
  netIncome: z.number().default(1000000),
  capex: z.number().default(500000),
  depreciation: z.number().default(200000),
  changeWC: z.number().default(100000),
  newDebt: z.number().default(300000),
  repayments: z.number().default(200000),
});

function evaluateAllFormulas(input: Fcfe_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.capex - input.depreciation; results["netCapEx"] = Number.isFinite(v) ? v : 0; } catch { results["netCapEx"] = 0; }
  try { const v = input.newDebt - input.repayments; results["netBorrowing"] = Number.isFinite(v) ? v : 0; } catch { results["netBorrowing"] = 0; }
  try { const v = input.netIncome - (results["netCapEx"] ?? 0) - input.changeWC + (results["netBorrowing"] ?? 0); results["fcfe"] = Number.isFinite(v) ? v : 0; } catch { results["fcfe"] = 0; }
  return results;
}


export function calculateFcfe_calculator(input: Fcfe_calculatorInput): Fcfe_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fcfe"] ?? 0;
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


export interface Fcfe_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
