// Auto-generated from kalite-maliyeti-paf-schema.json
import * as z from 'zod';

export interface Kalite_maliyeti_pafInput {
  egitimPlanlamaButcesi: number;
  muayeneTestMaliyeti: number;
  hurdaYeniden_IslemeMaliyeti: number;
  durusMaliyeti: number;
  garantiIadeMaliyeti: number;
  kayipSatisTahmini: number;
  toplamGelir: number;
  dataConfidence?: number;
}

export const Kalite_maliyeti_pafInputSchema = z.object({
  egitimPlanlamaButcesi: z.number().min(0).default(0),
  muayeneTestMaliyeti: z.number().min(0).default(0),
  hurdaYeniden_IslemeMaliyeti: z.number().min(0).default(0),
  durusMaliyeti: z.number().min(0).default(0),
  garantiIadeMaliyeti: z.number().min(0).default(0),
  kayipSatisTahmini: z.number().min(0).default(0),
  toplamGelir: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kalite_maliyeti_pafInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.egitimPlanlamaButcesi * input.muayeneTestMaliyeti * input.hurdaYeniden_IslemeMaliyeti * input.durusMaliyeti; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.egitimPlanlamaButcesi * input.muayeneTestMaliyeti * input.hurdaYeniden_IslemeMaliyeti * input.durusMaliyeti * (input.garantiIadeMaliyeti * input.kayipSatisTahmini * input.toplamGelir); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.garantiIadeMaliyeti * input.kayipSatisTahmini * input.toplamGelir; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateKalite_maliyeti_paf(input: Kalite_maliyeti_pafInput): Kalite_maliyeti_pafOutput {
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Kalite_maliyeti_pafOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kalite_maliyeti_pafOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

