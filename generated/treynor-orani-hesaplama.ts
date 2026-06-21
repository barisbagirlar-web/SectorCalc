// Auto-generated from treynor-orani-hesaplama-schema.json
import * as z from 'zod';

export interface Treynor_orani_hesaplamaInput {
  portfoyGetirisi: number;
  risksizFaiz: number;
  beta: number;
  dataConfidence?: number;
}

export const Treynor_orani_hesaplamaInputSchema = z.object({
  portfoyGetirisi: z.number().min(0).default(15),
  risksizFaiz: z.number().min(0).default(8),
  beta: z.number().min(0).default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Treynor_orani_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.portfoyGetirisi - input.risksizFaiz) / Math.max(0.0001, input.beta); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTreynor_orani_hesaplama(input: Treynor_orani_hesaplamaInput): Treynor_orani_hesaplamaOutput {
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


export interface Treynor_orani_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Treynor_orani_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "ratio",
  breakdownKeys: ["sonuc"],
} as const;

