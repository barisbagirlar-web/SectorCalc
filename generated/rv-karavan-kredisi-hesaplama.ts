// Auto-generated from rv-karavan-kredisi-hesaplama-schema.json
import * as z from 'zod';

export interface Rv_karavan_kredisi_hesaplamaInput {
  fiyat: number;
  pesin: number;
  faiz: number;
  vade: number;
  dataConfidence?: number;
}

export const Rv_karavan_kredisi_hesaplamaInputSchema = z.object({
  fiyat: z.number().min(0).default(800000),
  pesin: z.number().min(0).default(160000),
  faiz: z.number().min(0).default(15),
  vade: z.number().min(1).default(120),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rv_karavan_kredisi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fiyat - input.pesin) * ((input.faiz / 1200) * Math.pow(1 + input.faiz / 1200, input.vade)) / (Math.pow(1 + input.faiz / 1200, input.vade) - 1); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateRv_karavan_kredisi_hesaplama(input: Rv_karavan_kredisi_hesaplamaInput): Rv_karavan_kredisi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Compare multiple loan offers before committing.","Consider total cost including fees."];
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


export interface Rv_karavan_kredisi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Rv_karavan_kredisi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

