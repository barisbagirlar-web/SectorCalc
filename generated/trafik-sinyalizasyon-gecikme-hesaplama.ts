// Auto-generated from trafik-sinyalizasyon-gecikme-hesaplama-schema.json
import * as z from 'zod';

export interface Trafik_sinyalizasyon_gecikme_hesaplamaInput {
  donguSuresi: number;
  yesilSure: number;
  akisHizi: number;
  doygunAkis: number;
  dataConfidence?: number;
}

export const Trafik_sinyalizasyon_gecikme_hesaplamaInputSchema = z.object({
  donguSuresi: z.number().min(0).default(90),
  yesilSure: z.number().min(0).default(30),
  akisHizi: z.number().min(0).default(0.3),
  doygunAkis: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Trafik_sinyalizasyon_gecikme_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (90 * Math.pow((1 - 30/Math.max(1,90)), 2)) / Math.max(0.0001, (2 * (1 - (0.3/Math.max(0.0001, 0.5))))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTrafik_sinyalizasyon_gecikme_hesaplama(input: Trafik_sinyalizasyon_gecikme_hesaplamaInput): Trafik_sinyalizasyon_gecikme_hesaplamaOutput {
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
    unit: "s/veh",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Trafik_sinyalizasyon_gecikme_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Trafik_sinyalizasyon_gecikme_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "s/veh",
  breakdownKeys: ["sonuc"],
} as const;

