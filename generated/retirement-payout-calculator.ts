// Auto-generated from retirement-payout-calculator-schema.json
import * as z from 'zod';

export interface Retirement_payout_calculatorInput {
  birikim: number;
  faiz: number;
  sure: number;
  dataConfidence?: number;
}

export const Retirement_payout_calculatorInputSchema = z.object({
  birikim: z.number().min(0).default(1000000),
  faiz: z.number().min(0).default(6),
  sure: z.number().min(1).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Retirement_payout_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.birikim * ((input.faiz/100) / Math.max(0.0001, (1 - Math.pow(1 + input.faiz/100, -input.sure)))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateRetirement_payout_calculator(input: Retirement_payout_calculatorInput): Retirement_payout_calculatorOutput {
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


export interface Retirement_payout_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Retirement_payout_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

