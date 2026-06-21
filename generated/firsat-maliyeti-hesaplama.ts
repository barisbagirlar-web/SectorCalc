// Auto-generated from firsat-maliyeti-hesaplama-schema.json
import * as z from 'zod';

export interface Firsat_maliyeti_hesaplamaInput {
  tercihEdilenGetiri: number;
  vazgecilenGetiri: number;
  dataConfidence?: number;
}

export const Firsat_maliyeti_hesaplamaInputSchema = z.object({
  tercihEdilenGetiri: z.number().min(0).default(15000),
  vazgecilenGetiri: z.number().min(0).default(25000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Firsat_maliyeti_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vazgecilenGetiri - input.tercihEdilenGetiri; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateFirsat_maliyeti_hesaplama(input: Firsat_maliyeti_hesaplamaInput): Firsat_maliyeti_hesaplamaOutput {
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Firsat_maliyeti_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Firsat_maliyeti_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

