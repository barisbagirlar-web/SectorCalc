// Auto-generated from enjeksiyon-kapanma-tonaj-hesaplama-schema.json
import * as z from 'zod';

export interface Enjeksiyon_kapanma_tonaj_hesaplamaInput {
  projeksiyonAlani: number;
  kalipIcBasinc: number;
  dataConfidence?: number;
}

export const Enjeksiyon_kapanma_tonaj_hesaplamaInputSchema = z.object({
  projeksiyonAlani: z.number().min(0).default(500),
  kalipIcBasinc: z.number().min(0).default(800),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Enjeksiyon_kapanma_tonaj_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.projeksiyonAlani * input.kalipIcBasinc) / 1000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEnjeksiyon_kapanma_tonaj_hesaplama(input: Enjeksiyon_kapanma_tonaj_hesaplamaInput): Enjeksiyon_kapanma_tonaj_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Waste in material or time indicates process improvement opportunity."];
  const suggestedActions: string[] = ["Optimize drying/cooling parameters for cycle time reduction.","Monitor defects and adjust process conditions accordingly."];
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
    unit: "tons",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Enjeksiyon_kapanma_tonaj_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Enjeksiyon_kapanma_tonaj_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "tons",
  breakdownKeys: ["sonuc"],
} as const;

