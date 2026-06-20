// Auto-generated from fcfe-calculator-schema.json
import * as z from 'zod';

export interface Fcfe_calculatorInput {
  netIncome: number;
  capex: number;
  depreciation: number;
  changeWC: number;
  newDebt: number;
  repayments: number;
  dataConfidence?: number;
}

export const Fcfe_calculatorInputSchema = z.object({
  netIncome: z.number().default(1000000),
  capex: z.number().default(500000),
  depreciation: z.number().default(200000),
  changeWC: z.number().default(100000),
  newDebt: z.number().default(300000),
  repayments: z.number().default(200000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fcfe_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.capex - input.depreciation; results["netCapEx"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netCapEx"] = Number.NaN; }
  try { const v = input.newDebt - input.repayments; results["netBorrowing"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netBorrowing"] = Number.NaN; }
  try { const v = input.netIncome - (toNumericFormulaValue(results["netCapEx"])) - input.changeWC + (toNumericFormulaValue(results["netBorrowing"])); results["fcfe"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fcfe"] = Number.NaN; }
  return results;
}


export function calculateFcfe_calculator(input: Fcfe_calculatorInput): Fcfe_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["fcfe"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
