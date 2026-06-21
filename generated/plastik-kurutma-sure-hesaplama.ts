// Auto-generated from plastik-kurutma-sure-hesaplama-schema.json
import * as z from 'zod';

export interface Plastik_kurutma_sure_hesaplamaInput {
  malzemeKutle: number;
  nemOrani: number;
  havaDebi: number;
  nemAlmaKapasite: number;
  dataConfidence?: number;
}

export const Plastik_kurutma_sure_hesaplamaInputSchema = z.object({
  malzemeKutle: z.number().min(0).default(50),
  nemOrani: z.number().min(0).default(0.5),
  havaDebi: z.number().min(0).default(0.5),
  nemAlmaKapasite: z.number().min(0).default(0.005),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Plastik_kurutma_sure_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.malzemeKutle * (input.nemOrani / 100)) / Math.max(0.0001, (input.havaDebi * input.nemAlmaKapasite)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculatePlastik_kurutma_sure_hesaplama(input: Plastik_kurutma_sure_hesaplamaInput): Plastik_kurutma_sure_hesaplamaOutput {
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
    unit: "s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Plastik_kurutma_sure_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Plastik_kurutma_sure_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "s",
  breakdownKeys: ["sonuc"],
} as const;

