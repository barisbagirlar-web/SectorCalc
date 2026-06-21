// Auto-generated from training-impulse-calculator-schema.json
import * as z from 'zod';

export interface Training_impulse_calculatorInput {
  sure: number;
  ortalamaNabiz: number;
  dinlenmeNabzi: number;
  maksNabiz: number;
  cinsiyet: number;
  dataConfidence?: number;
}

export const Training_impulse_calculatorInputSchema = z.object({
  sure: z.number().min(0).default(60),
  ortalamaNabiz: z.number().min(0).default(145),
  dinlenmeNabzi: z.number().min(0).default(65),
  maksNabiz: z.number().min(0).default(190),
  cinsiyet: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Training_impulse_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cinsiyet === 1 ? 1.92 : 1.67; results["Y"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Y"] = Number.NaN; }
  try { const v = input.sure * ((input.ortalamaNabiz-input.dinlenmeNabzi)/Math.max(1,(input.maksNabiz-input.dinlenmeNabzi))) * 0.64 * Math.exp((input.cinsiyet === 1 ? 1.92 : 1.67) * ((input.ortalamaNabiz-input.dinlenmeNabzi)/Math.max(1,(input.maksNabiz-input.dinlenmeNabzi)))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTraining_impulse_calculator(input: Training_impulse_calculatorInput): Training_impulse_calculatorOutput {
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
    unit: "TRIMP",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Training_impulse_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Training_impulse_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRIMP",
  breakdownKeys: ["sonuc"],
} as const;

