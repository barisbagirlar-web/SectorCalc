// Auto-generated from kilit-tasi-paver-hesaplama-schema.json
import * as z from 'zod';

export interface Kilit_tasi_paver_hesaplamaInput {
  alan: number;
  tasEn: number;
  tasBoy: number;
  fire: number;
  dataConfidence?: number;
}

export const Kilit_tasi_paver_hesaplamaInputSchema = z.object({
  alan: z.number().min(0).default(30),
  tasEn: z.number().min(0).default(0.1),
  tasBoy: z.number().min(0).default(0.2),
  fire: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kilit_tasi_paver_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil((input.alan / Math.max(0.0001, (input.tasEn * input.tasBoy))) * (1 + input.fire / 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKilit_tasi_paver_hesaplama(input: Kilit_tasi_paver_hesaplamaInput): Kilit_tasi_paver_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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
    unit: "stones",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kilit_tasi_paver_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kilit_tasi_paver_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "stones",
  breakdownKeys: ["sonuc"],
} as const;

