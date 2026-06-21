// Auto-generated from hurda-orani-optimize-schema.json
import * as z from 'zod';

export interface Hurda_orani_optimizeInput {
  girdiHurda: number;
  nedenler: number;
  hammaddeMakine: number;
  salvage: number;
  hedef: number;
  marj: number;
  dataConfidence?: number;
}

export const Hurda_orani_optimizeInputSchema = z.object({
  girdiHurda: z.number().min(0).default(0),
  nedenler: z.number().min(0).default(0),
  hammaddeMakine: z.number().min(0).default(0),
  salvage: z.number().min(0).default(0),
  hedef: z.number().min(0).default(0),
  marj: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hurda_orani_optimizeInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.girdiHurda * input.nedenler * input.hammaddeMakine * input.salvage; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.girdiHurda * input.nedenler * input.hammaddeMakine * input.salvage * (input.hedef * input.marj); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.hedef * input.marj; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateHurda_orani_optimize(input: Hurda_orani_optimizeInput): Hurda_orani_optimizeOutput {
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


export interface Hurda_orani_optimizeOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hurda_orani_optimizeOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

