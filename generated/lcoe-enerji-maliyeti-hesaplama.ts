// Auto-generated from lcoe-enerji-maliyeti-hesaplama-schema.json
import * as z from 'zod';

export interface Lcoe_enerji_maliyeti_hesaplamaInput {
  toplamYatirim: number;
  toplamIsletme: number;
  toplamUretim: number;
  dataConfidence?: number;
}

export const Lcoe_enerji_maliyeti_hesaplamaInputSchema = z.object({
  toplamYatirim: z.number().min(0).default(5000000),
  toplamIsletme: z.number().min(0).default(2000000),
  toplamUretim: z.number().min(1).default(25000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lcoe_enerji_maliyeti_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.toplamYatirim + input.toplamIsletme) / Math.max(1, input.toplamUretim); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateLcoe_enerji_maliyeti_hesaplama(input: Lcoe_enerji_maliyeti_hesaplamaInput): Lcoe_enerji_maliyeti_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Conduct regular OEE audits for improvement.","Use SMED to reduce setup times."];
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
    unit: "TRY/kWh",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Lcoe_enerji_maliyeti_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Lcoe_enerji_maliyeti_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY/kWh",
  breakdownKeys: ["sonuc"],
} as const;

