// Auto-generated from medicare-prim-hesaplama-schema.json
import * as z from 'zod';

export interface Medicare_prim_hesaplamaInput {
  yillikGelir: number;
  bazPrim: number;
  ekOran: number;
  dataConfidence?: number;
}

export const Medicare_prim_hesaplamaInputSchema = z.object({
  yillikGelir: z.number().min(0).default(500000),
  bazPrim: z.number().min(0).default(5000),
  ekOran: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Medicare_prim_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 300000; results["esik"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["esik"] = Number.NaN; }
  try { const v = input.bazPrim + Math.max(0, (input.yillikGelir - 300000) * input.ekOran / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMedicare_prim_hesaplama(input: Medicare_prim_hesaplamaInput): Medicare_prim_hesaplamaOutput {
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


export interface Medicare_prim_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Medicare_prim_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

