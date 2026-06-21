// Auto-generated from cevresel-gurultu-yayilim-hesaplama-schema.json
import * as z from 'zod';

export interface Cevresel_gurultu_yayilim_hesaplamaInput {
  sesGucu: number;
  mesafe: number;
  zeminZayiflama: number;
  engelZayiflama: number;
  dataConfidence?: number;
}

export const Cevresel_gurultu_yayilim_hesaplamaInputSchema = z.object({
  sesGucu: z.number().min(0).default(100),
  mesafe: z.number().min(0).default(50),
  zeminZayiflama: z.number().min(0).default(3),
  engelZayiflama: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cevresel_gurultu_yayilim_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sesGucu - 20 * Math.log10(Math.max(1, input.mesafe)) - 11 - input.zeminZayiflama - input.engelZayiflama; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateCevresel_gurultu_yayilim_hesaplama(input: Cevresel_gurultu_yayilim_hesaplamaInput): Cevresel_gurultu_yayilim_hesaplamaOutput {
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
    unit: "dB",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Cevresel_gurultu_yayilim_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cevresel_gurultu_yayilim_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "dB",
  breakdownKeys: ["sonuc"],
} as const;

