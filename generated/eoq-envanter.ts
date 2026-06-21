// Auto-generated from eoq-envanter-schema.json
import * as z from 'zod';

export interface Eoq_envanterInput {
  yillikTalep: number;
  siparisMaliyet: number;
  leadTime: number;
  tasimaMaliyet: number;
  stdDev: number;
  hizmetSeviyesi: number;
  stoksuzMaliyet: number;
  dataConfidence?: number;
}

export const Eoq_envanterInputSchema = z.object({
  yillikTalep: z.number().min(0).default(0),
  siparisMaliyet: z.number().min(0).default(0),
  leadTime: z.number().min(0).default(0),
  tasimaMaliyet: z.number().min(0).default(0),
  stdDev: z.number().min(0).default(0),
  hizmetSeviyesi: z.number().min(0).default(0),
  stoksuzMaliyet: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Eoq_envanterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yillikTalep * input.siparisMaliyet * input.leadTime * input.tasimaMaliyet; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.yillikTalep * input.siparisMaliyet * input.leadTime * input.tasimaMaliyet * (input.stdDev * input.hizmetSeviyesi * input.stoksuzMaliyet); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.stdDev * input.hizmetSeviyesi * input.stoksuzMaliyet; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateEoq_envanter(input: Eoq_envanterInput): Eoq_envanterOutput {
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


export interface Eoq_envanterOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Eoq_envanterOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

