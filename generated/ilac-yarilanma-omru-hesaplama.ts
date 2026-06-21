// Auto-generated from ilac-yarilanma-omru-hesaplama-schema.json
import * as z from 'zod';

export interface Ilac_yarilanma_omru_hesaplamaInput {
  yarilanmaOmru: number;
  dozAraligi: number;
  dataConfidence?: number;
}

export const Ilac_yarilanma_omru_hesaplamaInputSchema = z.object({
  yarilanmaOmru: z.number().min(0).default(12),
  dozAraligi: z.number().min(0).default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ilac_yarilanma_omru_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.693 / Math.max(0.0001, input.yarilanmaOmru); results["k"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["k"] = Number.NaN; }
  try { const v = 1 / Math.max(0.0001, (1 - Math.exp(-(0.693 / Math.max(0.0001, input.yarilanmaOmru)) * input.dozAraligi))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateIlac_yarilanma_omru_hesaplama(input: Ilac_yarilanma_omru_hesaplamaInput): Ilac_yarilanma_omru_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low SLA indicates service reliability issue.","High latency degrades user experience."];
  const suggestedActions: string[] = ["Monitor system performance regularly.","Implement redundancy for critical infrastructure."];
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
    unit: "factor",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ilac_yarilanma_omru_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ilac_yarilanma_omru_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "factor",
  breakdownKeys: ["sonuc"],
} as const;

