// Auto-generated from kripto-para-kar-hesaplama-schema.json
import * as z from 'zod';

export interface Kripto_para_kar_hesaplamaInput {
  alis: number;
  satis: number;
  miktar: number;
  komisyon: number;
  dataConfidence?: number;
}

export const Kripto_para_kar_hesaplamaInputSchema = z.object({
  alis: z.number().min(0).default(1000),
  satis: z.number().min(0).default(1500),
  miktar: z.number().min(0).default(10),
  komisyon: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kripto_para_kar_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.satis - input.alis) * input.miktar * (1 - input.komisyon / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKripto_para_kar_hesaplama(input: Kripto_para_kar_hesaplamaInput): Kripto_para_kar_hesaplamaOutput {
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


export interface Kripto_para_kar_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kripto_para_kar_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

