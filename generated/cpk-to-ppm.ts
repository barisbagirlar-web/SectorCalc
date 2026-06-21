// Auto-generated from cpk-to-ppm-schema.json
import * as z from 'zod';

export interface Cpk_to_ppmInput {
  uSL: number;
  lSL: number;
  mean: number;
  stdDev: number;
  hedefCpk: number;
  gunlukHacim: number;
  dataConfidence?: number;
}

export const Cpk_to_ppmInputSchema = z.object({
  uSL: z.number().min(0).default(0),
  lSL: z.number().min(0).default(0),
  mean: z.number().min(0).default(0),
  stdDev: z.number().min(0).default(0),
  hedefCpk: z.number().min(0).default(0),
  gunlukHacim: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cpk_to_ppmInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.uSL * input.lSL * input.mean * input.stdDev; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.uSL * input.lSL * input.mean * input.stdDev * (input.hedefCpk * input.gunlukHacim); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.hedefCpk * input.gunlukHacim; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateCpk_to_ppm(input: Cpk_to_ppmInput): Cpk_to_ppmOutput {
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


export interface Cpk_to_ppmOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cpk_to_ppmOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

