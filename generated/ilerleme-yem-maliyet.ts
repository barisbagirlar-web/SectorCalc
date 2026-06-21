// Auto-generated from ilerleme-yem-maliyet-schema.json
import * as z from 'zod';

export interface Ilerleme_yem_maliyetInput {
  kisitlar: number;
  besin: number;
  fiyatlar: number;
  Ogutme: number;
  fire: number;
  fCR: number;
  kazanc: number;
  dataConfidence?: number;
}

export const Ilerleme_yem_maliyetInputSchema = z.object({
  kisitlar: z.number().min(0).default(0),
  besin: z.number().min(0).default(0),
  fiyatlar: z.number().min(0).default(0),
  Ogutme: z.number().min(0).default(0),
  fire: z.number().min(0).default(0),
  fCR: z.number().min(0).default(0),
  kazanc: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ilerleme_yem_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kisitlar * input.besin * input.fiyatlar * input.Ogutme; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.kisitlar * input.besin * input.fiyatlar * input.Ogutme * (input.fire * input.fCR * input.kazanc); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.fire * input.fCR * input.kazanc; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateIlerleme_yem_maliyet(input: Ilerleme_yem_maliyetInput): Ilerleme_yem_maliyetOutput {
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


export interface Ilerleme_yem_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ilerleme_yem_maliyetOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

