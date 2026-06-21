// Auto-generated from gbre-dozaj-schema.json
import * as z from 'zod';

export interface Gbre_dozajInput {
  hedefVerim: number;
  toprakNPK: number;
  Ihtiyac: number;
  verimlilik: number;
  alan: number;
  Icerik: number;
  fiyat: number;
  dataConfidence?: number;
}

export const Gbre_dozajInputSchema = z.object({
  hedefVerim: z.number().min(0).default(0),
  toprakNPK: z.number().min(0).default(0),
  Ihtiyac: z.number().min(0).default(0),
  verimlilik: z.number().min(0).default(0),
  alan: z.number().min(0).default(0),
  Icerik: z.number().min(0).default(0),
  fiyat: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gbre_dozajInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hedefVerim * input.toprakNPK * input.Ihtiyac * input.verimlilik; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.hedefVerim * input.toprakNPK * input.Ihtiyac * input.verimlilik * (input.alan * input.Icerik * input.fiyat); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.alan * input.Icerik * input.fiyat; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateGbre_dozaj(input: Gbre_dozajInput): Gbre_dozajOutput {
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


export interface Gbre_dozajOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gbre_dozajOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

