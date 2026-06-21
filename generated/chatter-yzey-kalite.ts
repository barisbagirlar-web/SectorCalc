// Auto-generated from chatter-yzey-kalite-schema.json
import * as z from 'zod';

export interface Chatter_yzey_kaliteInput {
  kesmeHiziVc: number;
  devirN: number;
  IlerlemeVf: number;
  disSayisiZ: number;
  takimUcuRadyusu: number;
  titresimGenligi: number;
  raLimiti: number;
  dataConfidence?: number;
}

export const Chatter_yzey_kaliteInputSchema = z.object({
  kesmeHiziVc: z.number().min(0).default(0),
  devirN: z.number().min(0).default(0),
  IlerlemeVf: z.number().min(0).default(0),
  disSayisiZ: z.number().min(0).default(0),
  takimUcuRadyusu: z.number().min(0).default(0),
  titresimGenligi: z.number().min(0).default(0),
  raLimiti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Chatter_yzey_kaliteInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kesmeHiziVc * input.devirN * input.IlerlemeVf * input.disSayisiZ; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.kesmeHiziVc * input.devirN * input.IlerlemeVf * input.disSayisiZ * (input.takimUcuRadyusu * input.titresimGenligi * input.raLimiti); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.takimUcuRadyusu * input.titresimGenligi * input.raLimiti; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateChatter_yzey_kalite(input: Chatter_yzey_kaliteInput): Chatter_yzey_kaliteOutput {
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


export interface Chatter_yzey_kaliteOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Chatter_yzey_kaliteOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

