// Auto-generated from tiklanma-basi-maliyet-cpc-hesaplama-schema.json
import * as z from 'zod';

export interface Tiklanma_basi_maliyet_cpc_hesaplamaInput {
  toplamHarcama: number;
  tiklama: number;
  dataConfidence?: number;
}

export const Tiklanma_basi_maliyet_cpc_hesaplamaInputSchema = z.object({
  toplamHarcama: z.number().min(0).default(10000),
  tiklama: z.number().min(1).default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tiklanma_basi_maliyet_cpc_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.toplamHarcama / Math.max(1, input.tiklama); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTiklanma_basi_maliyet_cpc_hesaplama(input: Tiklanma_basi_maliyet_cpc_hesaplamaInput): Tiklanma_basi_maliyet_cpc_hesaplamaOutput {
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


export interface Tiklanma_basi_maliyet_cpc_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tiklanma_basi_maliyet_cpc_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

