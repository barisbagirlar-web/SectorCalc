// Auto-generated from radyasyon-dozu-etkin-hesaplama-schema.json
import * as z from 'zod';

export interface Radyasyon_dozu_etkin_hesaplamaInput {
  sozurulenDoz: number;
  dokuAgirlikFaktoru: number;
  radyasyonTuruFaktoru: number;
  dataConfidence?: number;
}

export const Radyasyon_dozu_etkin_hesaplamaInputSchema = z.object({
  sozurulenDoz: z.number().min(0).default(10),
  dokuAgirlikFaktoru: z.number().min(0).default(0.12),
  radyasyonTuruFaktoru: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Radyasyon_dozu_etkin_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sozurulenDoz * input.dokuAgirlikFaktoru * input.radyasyonTuruFaktoru; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateRadyasyon_dozu_etkin_hesaplama(input: Radyasyon_dozu_etkin_hesaplamaInput): Radyasyon_dozu_etkin_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low SLA indicates service reliability issue.","High latency degrades user experience."];
  const suggestedActions: string[] = ["Monitor system performance regularly.","Implement redundancy for critical infrastructure."];
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
    unit: "mSv",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Radyasyon_dozu_etkin_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Radyasyon_dozu_etkin_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "mSv",
  breakdownKeys: ["sonuc"],
} as const;

