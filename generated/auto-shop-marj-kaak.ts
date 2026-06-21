// Auto-generated from auto-shop-marj-kaak-schema.json
import * as z from 'zod';

export interface Auto_shop_marj_kaakInput {
  parcaIscilikGeliri: number;
  cOGS: number;
  envanterFire: number;
  flagMevcutSaatler: number;
  benchmarkMarj: number;
  dataConfidence?: number;
}

export const Auto_shop_marj_kaakInputSchema = z.object({
  parcaIscilikGeliri: z.number().min(0).default(0),
  cOGS: z.number().min(0).default(0),
  envanterFire: z.number().min(0).default(0),
  flagMevcutSaatler: z.number().min(0).default(0),
  benchmarkMarj: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Auto_shop_marj_kaakInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.parcaIscilikGeliri * input.cOGS * input.envanterFire * input.flagMevcutSaatler; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.parcaIscilikGeliri * input.cOGS * input.envanterFire * input.flagMevcutSaatler * (input.benchmarkMarj); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.benchmarkMarj; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateAuto_shop_marj_kaak(input: Auto_shop_marj_kaakInput): Auto_shop_marj_kaakOutput {
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


export interface Auto_shop_marj_kaakOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Auto_shop_marj_kaakOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

