// Auto-generated from kapasitif-reaktans-hesaplama-schema.json
import * as z from 'zod';

export interface Kapasitif_reaktans_hesaplamaInput {
  frekans: number;
  kapasite: number;
  dataConfidence?: number;
}

export const Kapasitif_reaktans_hesaplamaInputSchema = z.object({
  frekans: z.number().min(0).default(50),
  kapasite: z.number().min(0).default(0.000001),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kapasitif_reaktans_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / Math.max(0.0001, (2 * Math.PI * input.frekans * input.kapasite)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKapasitif_reaktans_hesaplama(input: Kapasitif_reaktans_hesaplamaInput): Kapasitif_reaktans_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low Q factor indicates broader frequency response."];
  const suggestedActions: string[] = ["Verify component tolerances affect circuit performance.","Use proper safety equipment for high voltage/current work."];
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
    unit: "ohms",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kapasitif_reaktans_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kapasitif_reaktans_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "ohms",
  breakdownKeys: ["sonuc"],
} as const;

