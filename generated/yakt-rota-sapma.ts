// Auto-generated from yakt-rota-sapma-schema.json
import * as z from 'zod';

export interface Yakt_rota_sapmaInput {
  planliGercekMesafeKm: number;
  planliGercekTuketimLkm: number;
  rolantiSuresiSaat: number;
  rolantiTuketimLsaat: number;
  yakitFiyatiCurrencyL: number;
  dataConfidence?: number;
}

export const Yakt_rota_sapmaInputSchema = z.object({
  planliGercekMesafeKm: z.number().min(0).default(0),
  planliGercekTuketimLkm: z.number().min(0).default(0),
  rolantiSuresiSaat: z.number().min(0).default(0),
  rolantiTuketimLsaat: z.number().min(0).default(0),
  yakitFiyatiCurrencyL: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yakt_rota_sapmaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.planliGercekMesafeKm * input.planliGercekTuketimLkm * input.rolantiSuresiSaat * input.rolantiTuketimLsaat; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.planliGercekMesafeKm * input.planliGercekTuketimLkm * input.rolantiSuresiSaat * input.rolantiTuketimLsaat * (input.yakitFiyatiCurrencyL); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.yakitFiyatiCurrencyL; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateYakt_rota_sapma(input: Yakt_rota_sapmaInput): Yakt_rota_sapmaOutput {
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


export interface Yakt_rota_sapmaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yakt_rota_sapmaOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

