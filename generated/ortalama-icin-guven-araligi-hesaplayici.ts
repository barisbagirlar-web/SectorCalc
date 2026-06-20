// Auto-generated from ortalama-icin-guven-araligi-hesaplayici-schema.json
import * as z from 'zod';

export interface Ortalama_icin_guven_araligi_hesaplayiciInput {
  dataSet: number;
  sampleSize: number;
  dataConfidence?: number;
}

export const Ortalama_icin_guven_araligi_hesaplayiciInputSchema = z.object({
  dataSet: z.number().min(0).default(100),
  sampleSize: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ortalama_icin_guven_araligi_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dataSet * input.sampleSize + Math.floor(input.dataSet / input.sampleSize) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.dataSet * input.sampleSize + Math.floor(input.dataSet / input.sampleSize) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateOrtalama_icin_guven_araligi_hesaplayici(input: Ortalama_icin_guven_araligi_hesaplayiciInput): Ortalama_icin_guven_araligi_hesaplayiciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult with a professional.","Review assumptions regularly."];
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
    unit: "n",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Ortalama_icin_guven_araligi_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ortalama_icin_guven_araligi_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "n",
  breakdownKeys: ["result"],
} as const;

