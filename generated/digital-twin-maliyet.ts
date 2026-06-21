// Auto-generated from digital-twin-maliyet-schema.json
import * as z from 'zod';

export interface Digital_twin_maliyetInput {
  prototipSahaTesti: number;
  modelleme_Iscilik: number;
  bulutLisans: number;
  garantiDususu: number;
  erken_CikisGeliri: number;
  dataConfidence?: number;
}

export const Digital_twin_maliyetInputSchema = z.object({
  prototipSahaTesti: z.number().min(0).default(0),
  modelleme_Iscilik: z.number().min(0).default(0),
  bulutLisans: z.number().min(0).default(0),
  garantiDususu: z.number().min(0).default(0),
  erken_CikisGeliri: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Digital_twin_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.prototipSahaTesti * input.modelleme_Iscilik * input.bulutLisans * input.garantiDususu; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.prototipSahaTesti * input.modelleme_Iscilik * input.bulutLisans * input.garantiDususu * (input.erken_CikisGeliri); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.erken_CikisGeliri; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateDigital_twin_maliyet(input: Digital_twin_maliyetInput): Digital_twin_maliyetOutput {
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


export interface Digital_twin_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Digital_twin_maliyetOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

