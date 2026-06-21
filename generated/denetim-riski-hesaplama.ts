// Auto-generated from denetim-riski-hesaplama-schema.json
import * as z from 'zod';

export interface Denetim_riski_hesaplamaInput {
  dogustan: number;
  kontrol: number;
  tespit: number;
  dataConfidence?: number;
}

export const Denetim_riski_hesaplamaInputSchema = z.object({
  dogustan: z.number().min(0).max(100).default(50),
  kontrol: z.number().min(0).max(100).default(40),
  tespit: z.number().min(0).max(100).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Denetim_riski_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dogustan / 100) * (input.kontrol / 100) * (input.tespit / 100) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDenetim_riski_hesaplama(input: Denetim_riski_hesaplamaInput): Denetim_riski_hesaplamaOutput {
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Denetim_riski_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Denetim_riski_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

