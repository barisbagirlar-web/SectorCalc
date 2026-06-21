// Auto-generated from bin-gosterim-maliyeti-cpm-hesaplama-schema.json
import * as z from 'zod';

export interface Bin_gosterim_maliyeti_cpm_hesaplamaInput {
  reklamMaliyeti: number;
  gosterim: number;
  dataConfidence?: number;
}

export const Bin_gosterim_maliyeti_cpm_hesaplamaInputSchema = z.object({
  reklamMaliyeti: z.number().min(0).default(10000),
  gosterim: z.number().min(1).default(500000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bin_gosterim_maliyeti_cpm_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.reklamMaliyeti / Math.max(1, input.gosterim)) * 1000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBin_gosterim_maliyeti_cpm_hesaplama(input: Bin_gosterim_maliyeti_cpm_hesaplamaInput): Bin_gosterim_maliyeti_cpm_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Bin_gosterim_maliyeti_cpm_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Bin_gosterim_maliyeti_cpm_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

