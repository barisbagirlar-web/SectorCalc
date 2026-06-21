// Auto-generated from gage-rr-maliyet-schema.json
import * as z from 'zod';

export interface Gage_rr_maliyetInput {
  parcaN: number;
  operator: number;
  tekrarR: number;
  veri: number;
  tolerans: number;
  yanlisKabulRed: number;
  toplamKalite: number;
  dataConfidence?: number;
}

export const Gage_rr_maliyetInputSchema = z.object({
  parcaN: z.number().min(0).default(0),
  operator: z.number().min(0).default(0),
  tekrarR: z.number().min(0).default(0),
  veri: z.number().min(0).default(0),
  tolerans: z.number().min(0).default(0),
  yanlisKabulRed: z.number().min(0).default(0),
  toplamKalite: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gage_rr_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.parcaN * input.operator * input.tekrarR * input.veri; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.parcaN * input.operator * input.tekrarR * input.veri * (input.tolerans * input.yanlisKabulRed * input.toplamKalite); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.tolerans * input.yanlisKabulRed * input.toplamKalite; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateGage_rr_maliyet(input: Gage_rr_maliyetInput): Gage_rr_maliyetOutput {
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


export interface Gage_rr_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gage_rr_maliyetOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

