// Auto-generated from iskele-kiralama-schema.json
import * as z from 'zod';

export interface Iskele_kiralamaInput {
  CevreYukseklik: number;
  sure: number;
  mKiralamaIscilik: number;
  sefer: number;
  kritikYol: number;
  risk: number;
  dataConfidence?: number;
}

export const Iskele_kiralamaInputSchema = z.object({
  CevreYukseklik: z.number().min(0).default(0),
  sure: z.number().min(0).default(0),
  mKiralamaIscilik: z.number().min(0).default(0),
  sefer: z.number().min(0).default(0),
  kritikYol: z.number().min(0).default(0),
  risk: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Iskele_kiralamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.CevreYukseklik * input.sure * input.mKiralamaIscilik * input.sefer; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.CevreYukseklik * input.sure * input.mKiralamaIscilik * input.sefer * (input.kritikYol * input.risk); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.kritikYol * input.risk; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateIskele_kiralama(input: Iskele_kiralamaInput): Iskele_kiralamaOutput {
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


export interface Iskele_kiralamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Iskele_kiralamaOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

