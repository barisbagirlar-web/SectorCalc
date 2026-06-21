// Auto-generated from tam-hayat-sigortasi-hesaplama-schema.json
import * as z from 'zod';

export interface Tam_hayat_sigortasi_hesaplamaInput {
  yillikPrim: number;
  faiz: number;
  yil: number;
  dataConfidence?: number;
}

export const Tam_hayat_sigortasi_hesaplamaInputSchema = z.object({
  yillikPrim: z.number().min(0).default(10000),
  faiz: z.number().min(0).default(4),
  yil: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tam_hayat_sigortasi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yillikPrim * (((Math.pow(1 + input.faiz / 100, input.yil) - 1) / Math.max(0.0001, (input.faiz / 100)))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTam_hayat_sigortasi_hesaplama(input: Tam_hayat_sigortasi_hesaplamaInput): Tam_hayat_sigortasi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review insurance coverage annually.","Consult a retirement planner for personalized strategy."];
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Tam_hayat_sigortasi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tam_hayat_sigortasi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

