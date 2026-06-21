// Auto-generated from calisma-sermayesi-hesaplama-schema.json
import * as z from 'zod';

export interface Calisma_sermayesi_hesaplamaInput {
  donenVarliklar: number;
  kisaVadeliBorc: number;
  dataConfidence?: number;
}

export const Calisma_sermayesi_hesaplamaInputSchema = z.object({
  donenVarliklar: z.number().min(0).default(500000),
  kisaVadeliBorc: z.number().min(0).default(300000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Calisma_sermayesi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.donenVarliklar - input.kisaVadeliBorc; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateCalisma_sermayesi_hesaplama(input: Calisma_sermayesi_hesaplamaInput): Calisma_sermayesi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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


export interface Calisma_sermayesi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Calisma_sermayesi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

