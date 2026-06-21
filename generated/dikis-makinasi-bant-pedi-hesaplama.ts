// Auto-generated from dikis-makinasi-bant-pedi-hesaplama-schema.json
import * as z from 'zod';

export interface Dikis_makinasi_bant_pedi_hesaplamaInput {
  dikisUzunluk: number;
  devirSayisi: number;
  dikisSikligi: number;
  dataConfidence?: number;
}

export const Dikis_makinasi_bant_pedi_hesaplamaInputSchema = z.object({
  dikisUzunluk: z.number().min(0).default(500),
  devirSayisi: z.number().min(0).default(4000),
  dikisSikligi: z.number().min(0).default(3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dikis_makinasi_bant_pedi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dikisUzunluk * input.dikisSikligi) / Math.max(0.0001, (input.devirSayisi / 60)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDikis_makinasi_bant_pedi_hesaplama(input: Dikis_makinasi_bant_pedi_hesaplamaInput): Dikis_makinasi_bant_pedi_hesaplamaOutput {
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
    unit: "s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Dikis_makinasi_bant_pedi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Dikis_makinasi_bant_pedi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "s",
  breakdownKeys: ["sonuc"],
} as const;

