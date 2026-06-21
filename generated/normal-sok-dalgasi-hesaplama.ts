// Auto-generated from normal-sok-dalgasi-hesaplama-schema.json
import * as z from 'zod';

export interface Normal_sok_dalgasi_hesaplamaInput {
  mach: number;
  basinc1: number;
  k: number;
  dataConfidence?: number;
}

export const Normal_sok_dalgasi_hesaplamaInputSchema = z.object({
  mach: z.number().min(1).default(2),
  basinc1: z.number().min(0).default(50000),
  k: z.number().min(0).default(1.4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Normal_sok_dalgasi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.basinc1 * (1 + (2 * input.k / (input.k + 1)) * (Math.pow(input.mach, 2) - 1)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateNormal_sok_dalgasi_hesaplama(input: Normal_sok_dalgasi_hesaplamaInput): Normal_sok_dalgasi_hesaplamaOutput {
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Normal_sok_dalgasi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Normal_sok_dalgasi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: ["sonuc"],
} as const;

