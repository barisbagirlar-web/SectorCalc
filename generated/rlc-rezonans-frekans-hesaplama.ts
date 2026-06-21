// Auto-generated from rlc-rezonans-frekans-hesaplama-schema.json
import * as z from 'zod';

export interface Rlc_rezonans_frekans_hesaplamaInput {
  L: number;
  C: number;
  R: number;
  dataConfidence?: number;
}

export const Rlc_rezonans_frekans_hesaplamaInputSchema = z.object({
  L: z.number().min(0).default(0.01),
  C: z.number().min(0).default(1e-7),
  R: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rlc_rezonans_frekans_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / Math.max(0.0001, (2 * Math.PI * Math.sqrt(Math.max(0.0001, input.L * input.C)))); results["f0"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["f0"] = Number.NaN; }
  try { const v = (1 / Math.max(0.0001, input.R)) * Math.sqrt(Math.max(0.0001, input.L / Math.max(0.0001, input.C))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateRlc_rezonans_frekans_hesaplama(input: Rlc_rezonans_frekans_hesaplamaInput): Rlc_rezonans_frekans_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    f0: toNumericFormulaValue(values["f0"]),
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
    unit: "Q",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Rlc_rezonans_frekans_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { f0: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Rlc_rezonans_frekans_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Q",
  breakdownKeys: ["f0","sonuc"],
} as const;

