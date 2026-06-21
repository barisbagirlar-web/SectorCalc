// Auto-generated from ic-verim-orani-irr-hesaplama-schema.json
import * as z from 'zod';

export interface Ic_verim_orani_irr_hesaplamaInput {
  yatirim: number;
  ortalamaNakit: number;
  yil: number;
  dataConfidence?: number;
}

export const Ic_verim_orani_irr_hesaplamaInputSchema = z.object({
  yatirim: z.number().min(0).default(100000),
  ortalamaNakit: z.number().min(0).default(35000),
  yil: z.number().min(1).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ic_verim_orani_irr_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.ortalamaNakit / Math.max(1, input.yatirim)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateIc_verim_orani_irr_hesaplama(input: Ic_verim_orani_irr_hesaplamaInput): Ic_verim_orani_irr_hesaplamaOutput {
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


export interface Ic_verim_orani_irr_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ic_verim_orani_irr_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

