// Auto-generated from annuity-hesaplama-schema.json
import * as z from 'zod';

export interface Annuity_hesaplamaInput {
  currentAge: number;
  retirementAge: number;
  dataConfidence?: number;
}

export const Annuity_hesaplamaInputSchema = z.object({
  currentAge: z.number().min(0).default(100),
  retirementAge: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Annuity_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentAge * Math.pow(1 + input.retirementAge/100, 1) + input.currentAge * input.retirementAge / 1000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.currentAge * Math.pow(1 + input.retirementAge/100, 1) + input.currentAge * input.retirementAge / 1000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateAnnuity_hesaplama(input: Annuity_hesaplamaInput): Annuity_hesaplamaOutput {
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
    unit: "years",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Annuity_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Annuity_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "years",
  breakdownKeys: ["result"],
} as const;

