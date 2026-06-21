// Auto-generated from brut-net-kar-hesaplama-schema.json
import * as z from 'zod';

export interface Brut_net_kar_hesaplamaInput {
  ciro: number;
  cogs: number;
  isletmeGideri: number;
  vergi: number;
  dataConfidence?: number;
}

export const Brut_net_kar_hesaplamaInputSchema = z.object({
  ciro: z.number().min(0).default(1000000),
  cogs: z.number().min(0).default(600000),
  isletmeGideri: z.number().min(0).default(200000),
  vergi: z.number().min(0).default(50000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Brut_net_kar_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ciro - input.cogs; results["brut"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["brut"] = Number.NaN; }
  try { const v = (input.ciro - input.cogs) - input.isletmeGideri - input.vergi; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBrut_net_kar_hesaplama(input: Brut_net_kar_hesaplamaInput): Brut_net_kar_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    brut: toNumericFormulaValue(values["brut"]),
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


export interface Brut_net_kar_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { brut: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Brut_net_kar_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["brut","sonuc"],
} as const;

