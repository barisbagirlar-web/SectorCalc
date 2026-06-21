// Auto-generated from etf-return-calculator-schema.json
import * as z from 'zod';

export interface Etf_return_calculatorInput {
  alisFiyati: number;
  satisFiyati: number;
  temettu: number;
  giderOrani: number;
  dataConfidence?: number;
}

export const Etf_return_calculatorInputSchema = z.object({
  alisFiyati: z.number().min(0).default(100),
  satisFiyati: z.number().min(0).default(115),
  temettu: z.number().min(0).default(2),
  giderOrani: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Etf_return_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.satisFiyati + input.temettu - input.alisFiyati) / Math.max(1, input.alisFiyati) * 100) - input.giderOrani; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEtf_return_calculator(input: Etf_return_calculatorInput): Etf_return_calculatorOutput {
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Etf_return_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Etf_return_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

