// Auto-generated from portfoy-optimizasyonu-hesaplama-schema.json
import * as z from 'zod';

export interface Portfoy_optimizasyonu_hesaplamaInput {
  beklenenGetiri: number;
  beklenenRisk: number;
  dataConfidence?: number;
}

export const Portfoy_optimizasyonu_hesaplamaInputSchema = z.object({
  beklenenGetiri: z.number().min(0).default(12),
  beklenenRisk: z.number().min(0).default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Portfoy_optimizasyonu_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.beklenenGetiri / Math.max(0.0001, input.beklenenRisk); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculatePortfoy_optimizasyonu_hesaplama(input: Portfoy_optimizasyonu_hesaplamaInput): Portfoy_optimizasyonu_hesaplamaOutput {
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


export interface Portfoy_optimizasyonu_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Portfoy_optimizasyonu_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "ratio",
  breakdownKeys: ["sonuc"],
} as const;

