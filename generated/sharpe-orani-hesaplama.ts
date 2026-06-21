// Auto-generated from sharpe-orani-hesaplama-schema.json
import * as z from 'zod';

export interface Sharpe_orani_hesaplamaInput {
  portfoyGetirisi: number;
  risksizFaiz: number;
  volatilite: number;
  dataConfidence?: number;
}

export const Sharpe_orani_hesaplamaInputSchema = z.object({
  portfoyGetirisi: z.number().min(0).default(15),
  risksizFaiz: z.number().min(0).default(8),
  volatilite: z.number().min(0).default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sharpe_orani_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.portfoyGetirisi - input.risksizFaiz) / Math.max(0.0001, input.volatilite); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSharpe_orani_hesaplama(input: Sharpe_orani_hesaplamaInput): Sharpe_orani_hesaplamaOutput {
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


export interface Sharpe_orani_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sharpe_orani_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "ratio",
  breakdownKeys: ["sonuc"],
} as const;

