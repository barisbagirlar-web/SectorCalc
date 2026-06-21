// Auto-generated from fha-loan-calculator-schema.json
import * as z from 'zod';

export interface Fha_loan_calculatorInput {
  kredi: number;
  pesinPrim: number;
  yillikPrim: number;
  dataConfidence?: number;
}

export const Fha_loan_calculatorInputSchema = z.object({
  kredi: z.number().min(0).default(1000000),
  pesinPrim: z.number().min(0).default(1.75),
  yillikPrim: z.number().min(0).default(0.85),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fha_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kredi * input.pesinPrim / 100; results["pesin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pesin"] = Number.NaN; }
  try { const v = (input.kredi * input.yillikPrim / 100) / 12; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateFha_loan_calculator(input: Fha_loan_calculatorInput): Fha_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    pesin: toNumericFormulaValue(values["pesin"]),
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify all property data with official documents.","Consult a mortgage broker for personalized rates."];
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


export interface Fha_loan_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { pesin: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fha_loan_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["pesin","sonuc"],
} as const;

