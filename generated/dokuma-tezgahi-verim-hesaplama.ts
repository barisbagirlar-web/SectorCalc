// Auto-generated from dokuma-tezgahi-verim-hesaplama-schema.json
import * as z from 'zod';

export interface Dokuma_tezgahi_verim_hesaplamaInput {
  atimSayisi: number;
  durusSure: number;
  vardiyaSure: number;
  kumasSikligi: number;
  dataConfidence?: number;
}

export const Dokuma_tezgahi_verim_hesaplamaInputSchema = z.object({
  atimSayisi: z.number().min(0).default(800),
  durusSure: z.number().min(0).default(20),
  vardiyaSure: z.number().min(0).default(480),
  kumasSikligi: z.number().min(0).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dokuma_tezgahi_verim_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vardiyaSure - input.durusSure; results["verimliSure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["verimliSure"] = Number.NaN; }
  try { const v = (800 * (480 - 20)) / Math.max(0.0001, (25 * 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDokuma_tezgahi_verim_hesaplama(input: Dokuma_tezgahi_verim_hesaplamaInput): Dokuma_tezgahi_verim_hesaplamaOutput {
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Dokuma_tezgahi_verim_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Dokuma_tezgahi_verim_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

