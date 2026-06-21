// Auto-generated from personal-loan-calculator-schema.json
import * as z from 'zod';

export interface Personal_loan_calculatorInput {
  tutar: number;
  faiz: number;
  vade: number;
  masraf: number;
  dataConfidence?: number;
}

export const Personal_loan_calculatorInputSchema = z.object({
  tutar: z.number().min(0).default(50000),
  faiz: z.number().min(0).default(24),
  vade: z.number().min(1).default(36),
  masraf: z.number().min(0).default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Personal_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.faiz === 0 ? (input.tutar - input.masraf) / Math.max(1, input.vade) : (input.tutar - input.masraf) * ((input.faiz / 1200) * Math.pow(1 + input.faiz / 1200, input.vade)) / (Math.pow(1 + input.faiz / 1200, input.vade) - 1); results["taksit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taksit"] = Number.NaN; }
  try { const v = ((input.faiz === 0 ? (input.tutar - input.masraf) / Math.max(1, input.vade) : (input.tutar - input.masraf) * ((input.faiz / 1200) * Math.pow(1 + input.faiz / 1200, input.vade)) / (Math.pow(1 + input.faiz / 1200, input.vade) - 1)) * input.vade + input.masraf - input.tutar); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculatePersonal_loan_calculator(input: Personal_loan_calculatorInput): Personal_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    taksit: toNumericFormulaValue(values["taksit"]),
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


export interface Personal_loan_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { taksit: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Personal_loan_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["taksit","sonuc"],
} as const;

