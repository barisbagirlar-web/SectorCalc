// Auto-generated from sortino-orani-hesaplama-schema.json
import * as z from 'zod';

export interface Sortino_orani_hesaplamaInput {
  portfoyGetirisi: number;
  risksizFaiz: number;
  asagiSapma: number;
  dataConfidence?: number;
}

export const Sortino_orani_hesaplamaInputSchema = z.object({
  portfoyGetirisi: z.number().min(0).default(15),
  risksizFaiz: z.number().min(0).default(8),
  asagiSapma: z.number().min(0).default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sortino_orani_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.portfoyGetirisi - input.risksizFaiz) / Math.max(0.0001, input.asagiSapma); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSortino_orani_hesaplama(input: Sortino_orani_hesaplamaInput): Sortino_orani_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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
    unit: "ratio",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Sortino_orani_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sortino_orani_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "ratio",
  breakdownKeys: ["sonuc"],
} as const;

