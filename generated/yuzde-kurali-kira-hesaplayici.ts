// Auto-generated from yuzde-kurali-kira-hesaplayici-schema.json
import * as z from 'zod';

export interface Yuzde_kurali_kira_hesaplayiciInput {
  aylikKira: number;
  mulkDegeri: number;
  dataConfidence?: number;
}

export const Yuzde_kurali_kira_hesaplayiciInputSchema = z.object({
  aylikKira: z.number().min(0).default(10000),
  mulkDegeri: z.number().min(0).default(1000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yuzde_kurali_kira_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.aylikKira / Math.max(1, input.mulkDegeri)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateYuzde_kurali_kira_hesaplayici(input: Yuzde_kurali_kira_hesaplayiciInput): Yuzde_kurali_kira_hesaplayiciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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


export interface Yuzde_kurali_kira_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yuzde_kurali_kira_hesaplayiciOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

