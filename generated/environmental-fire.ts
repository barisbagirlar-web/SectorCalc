// Auto-generated from environmental-fire-schema.json
import * as z from 'zod';

export interface Environmental_fireInput {
  tehlikesizTehlikeliGeriDonusum: number;
  havaEmisyon: number;
  depolamaBertarafBedeli: number;
  hurdaGelir: number;
  cezaRisk: number;
  dataConfidence?: number;
}

export const Environmental_fireInputSchema = z.object({
  tehlikesizTehlikeliGeriDonusum: z.number().min(0).default(0),
  havaEmisyon: z.number().min(0).default(0),
  depolamaBertarafBedeli: z.number().min(0).default(0),
  hurdaGelir: z.number().min(0).default(0),
  cezaRisk: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Environmental_fireInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tehlikesizTehlikeliGeriDonusum * input.havaEmisyon * input.depolamaBertarafBedeli * input.hurdaGelir; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.tehlikesizTehlikeliGeriDonusum * input.havaEmisyon * input.depolamaBertarafBedeli * input.hurdaGelir * (input.cezaRisk); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.cezaRisk; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateEnvironmental_fire(input: Environmental_fireInput): Environmental_fireOutput {
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


export interface Environmental_fireOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Environmental_fireOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

