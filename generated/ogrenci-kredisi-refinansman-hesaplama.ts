// Auto-generated from ogrenci-kredisi-refinansman-hesaplama-schema.json
import * as z from 'zod';

export interface Ogrenci_kredisi_refinansman_hesaplamaInput {
  eskiBakiye: number;
  eskiFaiz: number;
  yeniFaiz: number;
  vade: number;
  dataConfidence?: number;
}

export const Ogrenci_kredisi_refinansman_hesaplamaInputSchema = z.object({
  eskiBakiye: z.number().min(0).default(100000),
  eskiFaiz: z.number().min(0).default(12),
  yeniFaiz: z.number().min(0).default(8),
  vade: z.number().min(1).default(48),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ogrenci_kredisi_refinansman_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.eskiFaiz === 0 ? input.eskiBakiye / Math.max(1, input.vade) : input.eskiBakiye * ((input.eskiFaiz / 1200) * Math.pow(1 + input.eskiFaiz / 1200, input.vade)) / (Math.pow(1 + input.eskiFaiz / 1200, input.vade) - 1); results["eskiTaksit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eskiTaksit"] = Number.NaN; }
  try { const v = input.yeniFaiz === 0 ? input.eskiBakiye / Math.max(1, input.vade) : input.eskiBakiye * ((input.yeniFaiz / 1200) * Math.pow(1 + input.yeniFaiz / 1200, input.vade)) / (Math.pow(1 + input.yeniFaiz / 1200, input.vade) - 1); results["yeniTaksit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yeniTaksit"] = Number.NaN; }
  try { const v = ((input.eskiFaiz === 0 ? input.eskiBakiye / Math.max(1, input.vade) : input.eskiBakiye * ((input.eskiFaiz / 1200) * Math.pow(1 + input.eskiFaiz / 1200, input.vade)) / (Math.pow(1 + input.eskiFaiz / 1200, input.vade) - 1)) - (input.yeniFaiz === 0 ? input.eskiBakiye / Math.max(1, input.vade) : input.eskiBakiye * ((input.yeniFaiz / 1200) * Math.pow(1 + input.yeniFaiz / 1200, input.vade)) / (Math.pow(1 + input.yeniFaiz / 1200, input.vade) - 1))) * input.vade; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateOgrenci_kredisi_refinansman_hesaplama(input: Ogrenci_kredisi_refinansman_hesaplamaInput): Ogrenci_kredisi_refinansman_hesaplamaOutput {
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


export interface Ogrenci_kredisi_refinansman_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ogrenci_kredisi_refinansman_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

