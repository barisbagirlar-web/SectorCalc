// Auto-generated from antrenman-yuku-trimp-hesaplama-schema.json
import * as z from 'zod';

export interface Antrenman_yuku_trimp_hesaplamaInput {
  sure: number;
  ortalamaNabiz: number;
  dinlenmeNabzi: number;
  maksNabiz: number;
  cinsiyet: number;
  dataConfidence?: number;
}

export const Antrenman_yuku_trimp_hesaplamaInputSchema = z.object({
  sure: z.number().min(0).default(60),
  ortalamaNabiz: z.number().min(0).default(145),
  dinlenmeNabzi: z.number().min(0).default(65),
  maksNabiz: z.number().min(0).default(190),
  cinsiyet: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Antrenman_yuku_trimp_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cinsiyet === 1 ? 1.92 : 1.67; results["Y"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Y"] = Number.NaN; }
  try { const v = 60 * ((145-65)/Math.max(1,(190-65))) * 0.64 * Math.exp((input.cinsiyet === 1 ? 1.92 : 1.67) * ((145-65)/Math.max(1,(190-65)))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateAntrenman_yuku_trimp_hesaplama(input: Antrenman_yuku_trimp_hesaplamaInput): Antrenman_yuku_trimp_hesaplamaOutput {
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


export interface Antrenman_yuku_trimp_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Antrenman_yuku_trimp_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRIMP",
  breakdownKeys: ["sonuc"],
} as const;

