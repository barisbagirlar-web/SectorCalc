// Auto-generated from sev-guvenlik-faktoru-hesaplama-schema.json
import * as z from 'zod';

export interface Sev_guvenlik_faktoru_hesaplamaInput {
  kohezyon: number;
  normalGerilme: number;
  icSuratmeAcisi: number;
  kaymaGerilmesi: number;
  dataConfidence?: number;
}

export const Sev_guvenlik_faktoru_hesaplamaInputSchema = z.object({
  kohezyon: z.number().min(0).default(20),
  normalGerilme: z.number().min(0).default(100),
  icSuratmeAcisi: z.number().min(0).default(30),
  kaymaGerilmesi: z.number().min(0).default(80),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sev_guvenlik_faktoru_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kohezyon + (input.normalGerilme * Math.tan(input.icSuratmeAcisi * Math.PI / 180)); results["dayanim"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dayanim"] = Number.NaN; }
  try { const v = (input.kohezyon + (input.normalGerilme * Math.tan(input.icSuratmeAcisi * Math.PI / 180))) / Math.max(0.0001, input.kaymaGerilmesi); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSev_guvenlik_faktoru_hesaplama(input: Sev_guvenlik_faktoru_hesaplamaInput): Sev_guvenlik_faktoru_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low efficiency may indicate equipment or process issues."];
  const suggestedActions: string[] = ["Calibrate all measuring equipment regularly.","Use site-specific data when available."];
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
    unit: "safety",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Sev_guvenlik_faktoru_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sev_guvenlik_faktoru_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "safety",
  breakdownKeys: ["sonuc"],
} as const;

