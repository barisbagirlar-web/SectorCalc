// Auto-generated from kayma-gerilmesi-burulma-hesaplama-schema.json
import * as z from 'zod';

export interface Kayma_gerilmesi_burulma_hesaplamaInput {
  tork: number;
  yariCap: number;
  kutupsalAtalet: number;
  dataConfidence?: number;
}

export const Kayma_gerilmesi_burulma_hesaplamaInputSchema = z.object({
  tork: z.number().min(0).default(1000),
  yariCap: z.number().min(0).default(0.025),
  kutupsalAtalet: z.number().min(0).default(6.14e-7),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kayma_gerilmesi_burulma_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.tork * input.yariCap) / Math.max(0.0001, input.kutupsalAtalet); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKayma_gerilmesi_burulma_hesaplama(input: Kayma_gerilmesi_burulma_hesaplamaInput): Kayma_gerilmesi_burulma_hesaplamaOutput {
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


export interface Kayma_gerilmesi_burulma_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kayma_gerilmesi_burulma_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: ["sonuc"],
} as const;

