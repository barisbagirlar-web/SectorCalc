// Auto-generated from hidroelektrik-guc-hesaplama-schema.json
import * as z from 'zod';

export interface Hidroelektrik_guc_hesaplamaInput {
  debi: number;
  dusuYuksekligi: number;
  turbinVerim: number;
  dataConfidence?: number;
}

export const Hidroelektrik_guc_hesaplamaInputSchema = z.object({
  debi: z.number().min(0).default(50),
  dusuYuksekligi: z.number().min(0).default(100),
  turbinVerim: z.number().min(0).default(85),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hidroelektrik_guc_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1000 * 9.81 * input.debi * input.dusuYuksekligi * (input.turbinVerim / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateHidroelektrik_guc_hesaplama(input: Hidroelektrik_guc_hesaplamaInput): Hidroelektrik_guc_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low SNR indicates poor signal quality.","High Q indicates narrow bandwidth."];
  const suggestedActions: string[] = ["Use proper shielding for sensitive measurements.","Consider efficiency losses in energy calculations."];
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
    unit: "W",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Hidroelektrik_guc_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hidroelektrik_guc_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "W",
  breakdownKeys: ["sonuc"],
} as const;

