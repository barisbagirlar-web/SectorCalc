// Auto-generated from hsa-saglik-tasarruf-hesaplama-schema.json
import * as z from 'zod';

export interface Hsa_saglik_tasarruf_hesaplamaInput {
  yillikKatki: number;
  marjinalVergi: number;
  dataConfidence?: number;
}

export const Hsa_saglik_tasarruf_hesaplamaInputSchema = z.object({
  yillikKatki: z.number().min(0).default(30000),
  marjinalVergi: z.number().min(0).max(100).default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hsa_saglik_tasarruf_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yillikKatki * (input.marjinalVergi / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateHsa_saglik_tasarruf_hesaplama(input: Hsa_saglik_tasarruf_hesaplamaInput): Hsa_saglik_tasarruf_hesaplamaOutput {
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


export interface Hsa_saglik_tasarruf_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hsa_saglik_tasarruf_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

