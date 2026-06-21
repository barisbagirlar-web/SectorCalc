// Auto-generated from credit-card-processing-fee-calculator-schema.json
import * as z from 'zod';

export interface Credit_card_processing_fee_calculatorInput {
  satis: number;
  yuzde: number;
  sabit: number;
  dataConfidence?: number;
}

export const Credit_card_processing_fee_calculatorInputSchema = z.object({
  satis: z.number().min(0).default(1000),
  yuzde: z.number().min(0).default(2.5),
  sabit: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Credit_card_processing_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.satis * input.yuzde / 100) + input.sabit; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateCredit_card_processing_fee_calculator(input: Credit_card_processing_fee_calculatorInput): Credit_card_processing_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Compare multiple loan offers before committing.","Consider total cost including fees."];
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
    premiumFeatures: [],
  };
}


export interface Credit_card_processing_fee_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Credit_card_processing_fee_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

