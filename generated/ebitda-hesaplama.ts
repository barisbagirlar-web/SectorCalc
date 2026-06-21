// Auto-generated from ebitda-hesaplama-schema.json
import * as z from 'zod';

export interface Ebitda_hesaplamaInput {
  netKar: number;
  faiz: number;
  vergi: number;
  amortisman: number;
  dataConfidence?: number;
}

export const Ebitda_hesaplamaInputSchema = z.object({
  netKar: z.number().min(0).default(150000),
  faiz: z.number().min(0).default(20000),
  vergi: z.number().min(0).default(45000),
  amortisman: z.number().min(0).default(30000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ebitda_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netKar * input.faiz * input.vergi * input.amortisman; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.netKar * input.faiz * input.vergi * input.amortisman; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateEbitda_hesaplama(input: Ebitda_hesaplamaInput): Ebitda_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"])
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ebitda_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ebitda_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product"],
} as const;

