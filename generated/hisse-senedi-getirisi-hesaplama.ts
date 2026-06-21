// Auto-generated from hisse-senedi-getirisi-hesaplama-schema.json
import * as z from 'zod';

export interface Hisse_senedi_getirisi_hesaplamaInput {
  alis: number;
  satis: number;
  temettu: number;
  dataConfidence?: number;
}

export const Hisse_senedi_getirisi_hesaplamaInputSchema = z.object({
  alis: z.number().min(0).default(50),
  satis: z.number().min(0).default(75),
  temettu: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hisse_senedi_getirisi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.satis - input.alis) + input.temettu) / Math.max(1, input.alis) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateHisse_senedi_getirisi_hesaplama(input: Hisse_senedi_getirisi_hesaplamaInput): Hisse_senedi_getirisi_hesaplamaOutput {
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


export interface Hisse_senedi_getirisi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hisse_senedi_getirisi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

