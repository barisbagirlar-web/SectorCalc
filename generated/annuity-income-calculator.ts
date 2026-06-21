// Auto-generated from annuity-income-calculator-schema.json
import * as z from 'zod';

export interface Annuity_income_calculatorInput {
  anapara: number;
  faiz: number;
  donem: number;
  dataConfidence?: number;
}

export const Annuity_income_calculatorInputSchema = z.object({
  anapara: z.number().min(0).default(500000),
  faiz: z.number().min(0).default(8),
  donem: z.number().min(1).default(120),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Annuity_income_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.faiz / 12 / 100; results["aylikOran"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aylikOran"] = Number.NaN; }
  try { const v = input.anapara * ((input.faiz/12/100) / Math.max(0.0001, (1 - Math.pow(1 + input.faiz/12/100, -input.donem)))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateAnnuity_income_calculator(input: Annuity_income_calculatorInput): Annuity_income_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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


export interface Annuity_income_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Annuity_income_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

