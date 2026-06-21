// Auto-generated from auto-shop-marj-kacak-schema.json
import * as z from 'zod';

export interface Auto_shop_marj_kacakInput {
  PartsRevenue: number;
  PartsCOGS: number;
  TotalLaborRevenue: number;
  TotalFlagHours: number;
  TotalAvailableHours: number;
  Discount: number;
  TotalRevenue: number;
  InventoryShrinkage: number;
  TotalCOGS: number;
  TotalOpEx: number;
  TargetMargin: number;
  dataConfidence?: number;
}

export const Auto_shop_marj_kacakInputSchema = z.object({
  PartsRevenue: z.number().min(0).default(0),
  PartsCOGS: z.number().min(0).default(0),
  TotalLaborRevenue: z.number().min(0).default(0),
  TotalFlagHours: z.number().min(0).default(0),
  TotalAvailableHours: z.number().min(0).default(0),
  Discount: z.number().min(0).default(0),
  TotalRevenue: z.number().min(0).default(0),
  InventoryShrinkage: z.number().min(0).default(0),
  TotalCOGS: z.number().min(0).default(0),
  TotalOpEx: z.number().min(0).default(0),
  TargetMargin: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Auto_shop_marj_kacakInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.PartsRevenue - input.PartsCOGS) / input.PartsRevenue; results["GrossMargin_Parts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["GrossMargin_Parts"] = Number.NaN; }
  try { const v = input.TotalLaborRevenue / input.TotalFlagHours; results["EffectiveLaborRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EffectiveLaborRate"] = Number.NaN; }
  try { const v = input.TotalFlagHours / input.TotalAvailableHours; results["ProductivityRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ProductivityRate"] = Number.NaN; }
  results["MarginLeak_Discount"] = Number.NaN;
  try { const v = input.InventoryShrinkage / input.PartsCOGS; results["MarginLeak_Shrinkage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MarginLeak_Shrinkage"] = Number.NaN; }
  try { const v = (input.TotalRevenue - input.TotalCOGS - input.TotalOpEx) / input.TotalRevenue; results["NetMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NetMargin"] = Number.NaN; }
  try { const v = input.TotalRevenue * (input.TargetMargin - (toNumericFormulaValue(results["NetMargin"]))); results["AnnualLeakage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AnnualLeakage"] = Number.NaN; }
  return results;
}


export function calculateAuto_shop_marj_kacak(input: Auto_shop_marj_kacakInput): Auto_shop_marj_kacakOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["AnnualLeakage"]);
  const breakdown = {
    GrossMargin_Parts: toNumericFormulaValue(values["GrossMargin_Parts"]),
    EffectiveLaborRate: toNumericFormulaValue(values["EffectiveLaborRate"]),
    ProductivityRate: toNumericFormulaValue(values["ProductivityRate"]),
    MarginLeak_Discount: toNumericFormulaValue(values["MarginLeak_Discount"]),
    MarginLeak_Shrinkage: toNumericFormulaValue(values["MarginLeak_Shrinkage"]),
    NetMargin: toNumericFormulaValue(values["NetMargin"]),
    AnnualLeakage: toNumericFormulaValue(values["AnnualLeakage"])
  };
  const hiddenLossDrivers: string[] = ["Verify assumptions with real data","Cross-check with industry benchmarks"];
  const suggestedActions: string[] = ["Run sensitivity analysis","Review assumptions with domain expert"];
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report","Action plan"],
  };
}


export interface Auto_shop_marj_kacakOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { GrossMargin_Parts: number; EffectiveLaborRate: number; ProductivityRate: number; MarginLeak_Discount: number; MarginLeak_Shrinkage: number; NetMargin: number; AnnualLeakage: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Auto_shop_marj_kacakOutputMeta = {
  primaryKey: "AnnualLeakage",
  unit: "USD",
  breakdownKeys: ["GrossMargin_Parts","EffectiveLaborRate","ProductivityRate","MarginLeak_Discount","MarginLeak_Shrinkage","NetMargin","AnnualLeakage"],
} as const;

