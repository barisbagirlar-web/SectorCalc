// Auto-generated from kaynak-isi-girdisi-hesaplama-schema.json
import * as z from 'zod';

export interface Kaynak_isi_girdisi_hesaplamaInput {
  akim: number;
  gerilim: number;
  ilerlemeHiz: number;
  verim: number;
  dataConfidence?: number;
}

export const Kaynak_isi_girdisi_hesaplamaInputSchema = z.object({
  akim: z.number().min(0).default(200),
  gerilim: z.number().min(0).default(25),
  ilerlemeHiz: z.number().min(0).default(5),
  verim: z.number().min(0).default(0.8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kaynak_isi_girdisi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.akim * input.gerilim * input.verim) / Math.max(0.0001, input.ilerlemeHiz); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKaynak_isi_girdisi_hesaplama(input: Kaynak_isi_girdisi_hesaplamaInput): Kaynak_isi_girdisi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "J/mm",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kaynak_isi_girdisi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kaynak_isi_girdisi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "J/mm",
  breakdownKeys: ["sonuc"],
} as const;

