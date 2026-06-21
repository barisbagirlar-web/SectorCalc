// Auto-generated from usd-kredisi-hesaplama-schema.json
import * as z from 'zod';

export interface Usd_kredisi_hesaplamaInput {
  tutar: number;
  faiz: number;
  vade: number;
  kurBeklentisi: number;
  mevcutKur: number;
  dataConfidence?: number;
}

export const Usd_kredisi_hesaplamaInputSchema = z.object({
  tutar: z.number().min(0).default(50000),
  faiz: z.number().min(0).default(8),
  vade: z.number().min(1).default(36),
  kurBeklentisi: z.number().min(0).default(20),
  mevcutKur: z.number().min(0).default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Usd_kredisi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.faiz === 0 ? input.tutar / Math.max(1, input.vade) : input.tutar * ((input.faiz / 1200) * Math.pow(1 + input.faiz / 1200, input.vade)) / (Math.pow(1 + input.faiz / 1200, input.vade) - 1); results["usdTaksit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["usdTaksit"] = Number.NaN; }
  try { const v = (input.faiz === 0 ? input.tutar / Math.max(1, input.vade) : input.tutar * ((input.faiz / 1200) * Math.pow(1 + input.faiz / 1200, input.vade)) / (Math.pow(1 + input.faiz / 1200, input.vade) - 1)) * input.mevcutKur * Math.pow(1 + input.kurBeklentisi / 100, input.vade / 12); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateUsd_kredisi_hesaplama(input: Usd_kredisi_hesaplamaInput): Usd_kredisi_hesaplamaOutput {
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


export interface Usd_kredisi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Usd_kredisi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

