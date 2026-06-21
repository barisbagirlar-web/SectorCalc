// Auto-generated from insurance-premium-calculator-schema.json
import * as z from 'zod';

export interface Insurance_premium_calculatorInput {
  beklenenHasar: number;
  giderYuklemesi: number;
  karMarji: number;
  dataConfidence?: number;
}

export const Insurance_premium_calculatorInputSchema = z.object({
  beklenenHasar: z.number().min(0).default(1000),
  giderYuklemesi: z.number().min(0).default(30),
  karMarji: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Insurance_premium_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.beklenenHasar / Math.max(0.0001, (1 - (input.giderYuklemesi / 100) - (input.karMarji / 100))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateInsurance_premium_calculator(input: Insurance_premium_calculatorInput): Insurance_premium_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High asymmetry increases injury risk.","Low H-index may indicate limited academic impact."];
  const suggestedActions: string[] = ["Balance training for injury prevention.","Use peer review to validate research quality."];
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
    unit: "TL",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Insurance_premium_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Insurance_premium_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "TL",
  breakdownKeys: ["sonuc"],
} as const;

