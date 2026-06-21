// Auto-generated from orneklem-agirliklandirma-hesaplama-schema.json
import * as z from 'zod';

export interface Orneklem_agirliklandirma_hesaplamaInput {
  tabakaPopulasyon: number;
  toplamPopulasyon: number;
  tabakaOrneklem: number;
  toplamOrneklem: number;
  dataConfidence?: number;
}

export const Orneklem_agirliklandirma_hesaplamaInputSchema = z.object({
  tabakaPopulasyon: z.number().min(0).default(500),
  toplamPopulasyon: z.number().min(0).default(5000),
  tabakaOrneklem: z.number().min(0).default(50),
  toplamOrneklem: z.number().min(0).default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Orneklem_agirliklandirma_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.tabakaPopulasyon / Math.max(1, input.toplamPopulasyon)) / Math.max(0.0001, (input.tabakaOrneklem / Math.max(1, input.toplamOrneklem))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateOrneklem_agirliklandirma_hesaplama(input: Orneklem_agirliklandirma_hesaplamaInput): Orneklem_agirliklandirma_hesaplamaOutput {
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
    unit: "weight",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Orneklem_agirliklandirma_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Orneklem_agirliklandirma_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "weight",
  breakdownKeys: ["sonuc"],
} as const;

