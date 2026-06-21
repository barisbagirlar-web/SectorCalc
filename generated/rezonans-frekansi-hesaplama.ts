// Auto-generated from rezonans-frekansi-hesaplama-schema.json
import * as z from 'zod';

export interface Rezonans_frekansi_hesaplamaInput {
  kutle: number;
  yayKatsayisi: number;
  dataConfidence?: number;
}

export const Rezonans_frekansi_hesaplamaInputSchema = z.object({
  kutle: z.number().min(0).default(10),
  yayKatsayisi: z.number().min(0).default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rezonans_frekansi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / Math.max(0.0001, (2 * Math.PI * Math.sqrt(Math.max(0.0001, input.kutle / input.yayKatsayisi)))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateRezonans_frekansi_hesaplama(input: Rezonans_frekansi_hesaplamaInput): Rezonans_frekansi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "Hz",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Rezonans_frekansi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Rezonans_frekansi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Hz",
  breakdownKeys: ["sonuc"],
} as const;

