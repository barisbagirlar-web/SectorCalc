// Auto-generated from gage-rr-hesaplama-schema.json
import * as z from 'zod';

export interface Gage_rr_hesaplamaInput {
  parcaVaryans: number;
  olcumVaryans: number;
  dataConfidence?: number;
}

export const Gage_rr_hesaplamaInputSchema = z.object({
  parcaVaryans: z.number().min(0).default(100),
  olcumVaryans: z.number().min(0).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gage_rr_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.parcaVaryans + input.olcumVaryans; results["toplamVaryans"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["toplamVaryans"] = Number.NaN; }
  try { const v = (input.olcumVaryans / Math.max(0.0001, (input.parcaVaryans + input.olcumVaryans))) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateGage_rr_hesaplama(input: Gage_rr_hesaplamaInput): Gage_rr_hesaplamaOutput {
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Gage_rr_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gage_rr_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

