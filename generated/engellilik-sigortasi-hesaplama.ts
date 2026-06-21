// Auto-generated from engellilik-sigortasi-hesaplama-schema.json
import * as z from 'zod';

export interface Engellilik_sigortasi_hesaplamaInput {
  aylikGelir: number;
  odemeYuzdesi: number;
  dataConfidence?: number;
}

export const Engellilik_sigortasi_hesaplamaInputSchema = z.object({
  aylikGelir: z.number().min(0).default(15000),
  odemeYuzdesi: z.number().min(0).max(100).default(60),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Engellilik_sigortasi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.aylikGelir * (input.odemeYuzdesi / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEngellilik_sigortasi_hesaplama(input: Engellilik_sigortasi_hesaplamaInput): Engellilik_sigortasi_hesaplamaOutput {
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


export interface Engellilik_sigortasi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Engellilik_sigortasi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

