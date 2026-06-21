// Auto-generated from gemi-su-cekim-draft-hesaplama-schema.json
import * as z from 'zod';

export interface Gemi_su_cekim_draft_hesaplamaInput {
  deplasman: number;
  suYogunlugu: number;
  boy: number;
  en: number;
  blokKatsayi: number;
  dataConfidence?: number;
}

export const Gemi_su_cekim_draft_hesaplamaInputSchema = z.object({
  deplasman: z.number().min(0).default(5000),
  suYogunlugu: z.number().min(0).default(1.025),
  boy: z.number().min(0).default(100),
  en: z.number().min(0).default(18),
  blokKatsayi: z.number().min(0).default(0.7),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gemi_su_cekim_draft_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.deplasman / Math.max(0.0001, (input.suYogunlugu * input.boy * input.en * input.blokKatsayi)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateGemi_su_cekim_draft_hesaplama(input: Gemi_su_cekim_draft_hesaplamaInput): Gemi_su_cekim_draft_hesaplamaOutput {
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Gemi_su_cekim_draft_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gemi_su_cekim_draft_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

