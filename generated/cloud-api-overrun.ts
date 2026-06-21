// Auto-generated from cloud-api-overrun-schema.json
import * as z from 'zod';

export interface Cloud_api_overrunInput {
  aylikToplamDahil_Istek: number;
  asim_Ucreti: number;
  veri_CikisiGB: number;
  egressFiyat: number;
  sLATaahhutGercekUptime: number;
  dataConfidence?: number;
}

export const Cloud_api_overrunInputSchema = z.object({
  aylikToplamDahil_Istek: z.number().min(0).default(0),
  asim_Ucreti: z.number().min(0).default(0),
  veri_CikisiGB: z.number().min(0).default(0),
  egressFiyat: z.number().min(0).default(0),
  sLATaahhutGercekUptime: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cloud_api_overrunInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.aylikToplamDahil_Istek * input.asim_Ucreti * input.veri_CikisiGB * input.egressFiyat; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.aylikToplamDahil_Istek * input.asim_Ucreti * input.veri_CikisiGB * input.egressFiyat * (input.sLATaahhutGercekUptime); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.sLATaahhutGercekUptime; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateCloud_api_overrun(input: Cloud_api_overrunInput): Cloud_api_overrunOutput {
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


export interface Cloud_api_overrunOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cloud_api_overrunOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

