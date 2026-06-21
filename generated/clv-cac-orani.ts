// Auto-generated from clv-cac-orani-schema.json
import * as z from 'zod';

export interface Clv_cac_oraniInput {
  butce: number;
  yeniMusteri: number;
  siparisDegeri: number;
  siklik: number;
  yasamSuresi: number;
  churn: number;
  brutMarj: number;
  wACC: number;
  dataConfidence?: number;
}

export const Clv_cac_oraniInputSchema = z.object({
  butce: z.number().min(0).default(0),
  yeniMusteri: z.number().min(0).default(0),
  siparisDegeri: z.number().min(0).default(0),
  siklik: z.number().min(0).default(0),
  yasamSuresi: z.number().min(0).default(0),
  churn: z.number().min(0).default(0),
  brutMarj: z.number().min(0).default(0),
  wACC: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Clv_cac_oraniInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.butce * input.yeniMusteri * input.siparisDegeri * input.siklik; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.butce * input.yeniMusteri * input.siparisDegeri * input.siklik * (input.yasamSuresi * input.churn * input.brutMarj * input.wACC); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.yasamSuresi * input.churn * input.brutMarj * input.wACC; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateClv_cac_orani(input: Clv_cac_oraniInput): Clv_cac_oraniOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    unit: "units",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Clv_cac_oraniOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Clv_cac_oraniOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

