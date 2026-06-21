// Auto-generated from 1031-vergi-ertelemeli-takas-schema.json
import * as z from 'zod';

export interface _1031_vergi_ertelemeli_takasInput {
  satisFiyati: number;
  kalanBorc: number;
  yeniYatirim: number;
  dataConfidence?: number;
}

export const _1031_vergi_ertelemeli_takasInputSchema = z.object({
  satisFiyati: z.number().min(0).default(2000000),
  kalanBorc: z.number().min(0).default(500000),
  yeniYatirim: z.number().min(0).default(1800000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _1031_vergi_ertelemeli_takasInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.satisFiyati - input.kalanBorc; results["nakitCikis"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nakitCikis"] = Number.NaN; }
  try { const v = Math.max(0, (input.satisFiyati - input.kalanBorc) - input.yeniYatirim); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculate_1031_vergi_ertelemeli_takas(input: _1031_vergi_ertelemeli_takasInput): _1031_vergi_ertelemeli_takasOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"]),
    nakitCikis: toNumericFormulaValue(values["nakitCikis"])
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


export interface _1031_vergi_ertelemeli_takasOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number; nakitCikis: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const _1031_vergi_ertelemeli_takasOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc","nakitCikis"],
} as const;

