// Auto-generated from borc-konsolidasyon-hesaplama-schema.json
import * as z from 'zod';

export interface Borc_konsolidasyon_hesaplamaInput {
  toplamBorc: number;
  yeniFaiz: number;
  vade: number;
  dataConfidence?: number;
}

export const Borc_konsolidasyon_hesaplamaInputSchema = z.object({
  toplamBorc: z.number().min(0).default(100000),
  yeniFaiz: z.number().min(0).default(10),
  vade: z.number().min(1).default(60),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Borc_konsolidasyon_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.toplamBorc * ((input.yeniFaiz / 1200) * Math.pow(1 + input.yeniFaiz / 1200, input.vade)) / (Math.pow(1 + input.yeniFaiz / 1200, input.vade) - 1); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBorc_konsolidasyon_hesaplama(input: Borc_konsolidasyon_hesaplamaInput): Borc_konsolidasyon_hesaplamaOutput {
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


export interface Borc_konsolidasyon_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Borc_konsolidasyon_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

