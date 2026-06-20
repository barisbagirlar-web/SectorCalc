// Auto-generated from sum-yil-digits-amortisman-hesaplama-schema.json
import * as z from 'zod';

export interface Sum_yil_digits_amortisman_hesaplamaInput {
  loanAmount: number;
  interestRate: number;
  dataConfidence?: number;
}

export const Sum_yil_digits_amortisman_hesaplamaInputSchema = z.object({
  loanAmount: z.number().min(0).default(100),
  interestRate: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sum_yil_digits_amortisman_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loanAmount * Math.pow(1 + input.interestRate/100, 1) + input.loanAmount * input.interestRate / 1000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.loanAmount * Math.pow(1 + input.interestRate/100, 1) + input.loanAmount * input.interestRate / 1000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSum_yil_digits_amortisman_hesaplama(input: Sum_yil_digits_amortisman_hesaplamaInput): Sum_yil_digits_amortisman_hesaplamaOutput {
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
    unit: "currency",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Sum_yil_digits_amortisman_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sum_yil_digits_amortisman_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "currency",
  breakdownKeys: ["result"],
} as const;

