// Auto-generated from dongusel-ekonomi-hesaplama-schema.json
import * as z from 'zod';

export interface Dongusel_ekonomi_hesaplamaInput {
  geriKazanilan: number;
  toplamGirdi: number;
  dataConfidence?: number;
}

export const Dongusel_ekonomi_hesaplamaInputSchema = z.object({
  geriKazanilan: z.number().min(0).default(500),
  toplamGirdi: z.number().min(0).default(2000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dongusel_ekonomi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.geriKazanilan / Math.max(0.0001, input.toplamGirdi)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDongusel_ekonomi_hesaplama(input: Dongusel_ekonomi_hesaplamaInput): Dongusel_ekonomi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High environmental score may reduce operational costs.","Low ESG score may increase capital costs."];
  const suggestedActions: string[] = ["Set improvement targets for each ESG pillar.","Consider carbon offset programs for residual emissions."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Dongusel_ekonomi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Dongusel_ekonomi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

