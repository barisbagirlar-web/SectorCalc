// Auto-generated from cpm-gecikme-cezasi-schema.json
import * as z from 'zod';

export interface Cpm_gecikme_cezasiInput {
  planlananGercekSure: number;
  float: number;
  gunlukCeza: number;
  mucbirSebep: number;
  crashingMaliyeti: number;
  verimlilik: number;
  dataConfidence?: number;
}

export const Cpm_gecikme_cezasiInputSchema = z.object({
  planlananGercekSure: z.number().min(0).default(0),
  float: z.number().min(0).default(0),
  gunlukCeza: z.number().min(0).default(0),
  mucbirSebep: z.number().min(0).default(0),
  crashingMaliyeti: z.number().min(0).default(0),
  verimlilik: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cpm_gecikme_cezasiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.planlananGercekSure * input.float * input.gunlukCeza * input.mucbirSebep; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.planlananGercekSure * input.float * input.gunlukCeza * input.mucbirSebep * (input.crashingMaliyeti * input.verimlilik); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.crashingMaliyeti * input.verimlilik; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateCpm_gecikme_cezasi(input: Cpm_gecikme_cezasiInput): Cpm_gecikme_cezasiOutput {
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


export interface Cpm_gecikme_cezasiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cpm_gecikme_cezasiOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

