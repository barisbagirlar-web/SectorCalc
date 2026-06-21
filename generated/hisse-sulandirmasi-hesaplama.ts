// Auto-generated from hisse-sulandirmasi-hesaplama-schema.json
import * as z from 'zod';

export interface Hisse_sulandirmasi_hesaplamaInput {
  mevcutHisse: number;
  yeniHisse: number;
  dataConfidence?: number;
}

export const Hisse_sulandirmasi_hesaplamaInputSchema = z.object({
  mevcutHisse: z.number().min(0).default(1000000),
  yeniHisse: z.number().min(0).default(200000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hisse_sulandirmasi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yeniHisse / Math.max(1, (input.mevcutHisse + input.yeniHisse)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateHisse_sulandirmasi_hesaplama(input: Hisse_sulandirmasi_hesaplamaInput): Hisse_sulandirmasi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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


export interface Hisse_sulandirmasi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hisse_sulandirmasi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

