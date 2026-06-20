// Auto-generated from debt-to-sermaye-ratio-hesaplama-schema.json
import * as z from 'zod';

export interface Debt_to_sermaye_ratio_hesaplamaInput {
  loanAmount: number;
  interestRate: number;
  termYears: number;
  dataConfidence?: number;
}

export const Debt_to_sermaye_ratio_hesaplamaInputSchema = z.object({
  loanAmount: z.number().min(0).max(1000000000).default(200000),
  interestRate: z.number().min(0).max(100).default(6),
  termYears: z.number().min(1).max(50).default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Debt_to_sermaye_ratio_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loanAmount * (input.interestRate/100/12 * Math.pow(1+input.interestRate/100/12, input.termYears*12)) / (Math.pow(1+input.interestRate/100/12, input.termYears*12)-1); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.loanAmount * (input.interestRate/100/12 * Math.pow(1+input.interestRate/100/12, input.termYears*12)) / (Math.pow(1+input.interestRate/100/12, input.termYears*12)-1); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateDebt_to_sermaye_ratio_hesaplama(input: Debt_to_sermaye_ratio_hesaplamaInput): Debt_to_sermaye_ratio_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult with a professional.","Review assumptions regularly."];
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Debt_to_sermaye_ratio_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Debt_to_sermaye_ratio_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["result"],
} as const;

