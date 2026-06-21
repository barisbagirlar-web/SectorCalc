// Auto-generated from rneklem-bykl-endstri-mhendislii-schema.json
import * as z from 'zod';

export interface Rneklem_bykl_endstri_mhendisliiInput {
  populasyonN: number;
  guvenSeviyesiZ: number;
  hataPayiE: number;
  tahminiOranP: number;
  stdDevSigma: number;
  iCC: number;
  birimMuayeneMaliyeti: number;
  dataConfidence?: number;
}

export const Rneklem_bykl_endstri_mhendisliiInputSchema = z.object({
  populasyonN: z.number().min(0).default(0),
  guvenSeviyesiZ: z.number().min(0).default(0),
  hataPayiE: z.number().min(0).default(0),
  tahminiOranP: z.number().min(0).default(0),
  stdDevSigma: z.number().min(0).default(0),
  iCC: z.number().min(0).default(0),
  birimMuayeneMaliyeti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rneklem_bykl_endstri_mhendisliiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.populasyonN * input.guvenSeviyesiZ * input.hataPayiE * (input.tahminiOranP / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.populasyonN * input.guvenSeviyesiZ * input.hataPayiE * (input.tahminiOranP / 100) * (input.stdDevSigma * input.iCC * input.birimMuayeneMaliyeti); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.stdDevSigma * input.iCC * input.birimMuayeneMaliyeti; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateRneklem_bykl_endstri_mhendislii(input: Rneklem_bykl_endstri_mhendisliiInput): Rneklem_bykl_endstri_mhendisliiOutput {
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
    unit: "%",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Rneklem_bykl_endstri_mhendisliiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Rneklem_bykl_endstri_mhendisliiOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

