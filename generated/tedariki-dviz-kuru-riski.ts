// Auto-generated from tedariki-dviz-kuru-riski-schema.json
import * as z from 'zod';

export interface Tedariki_dviz_kuru_riskiInput {
  dovizCinsiSozlesmeBedeli: number;
  hedgeEdilmeyenOran: number;
  spotForwardKur: number;
  volatilite: number;
  zamanUfkuGun: number;
  zSkoru: number;
  dovizAyarlamaKlozuFaktoru: number;
  dataConfidence?: number;
}

export const Tedariki_dviz_kuru_riskiInputSchema = z.object({
  dovizCinsiSozlesmeBedeli: z.number().min(0).default(0),
  hedgeEdilmeyenOran: z.number().min(0).default(0),
  spotForwardKur: z.number().min(0).default(0),
  volatilite: z.number().min(0).default(0),
  zamanUfkuGun: z.number().min(0).default(0),
  zSkoru: z.number().min(0).default(0),
  dovizAyarlamaKlozuFaktoru: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tedariki_dviz_kuru_riskiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dovizCinsiSozlesmeBedeli * (input.hedgeEdilmeyenOran / 100) * input.spotForwardKur * input.volatilite; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.dovizCinsiSozlesmeBedeli * (input.hedgeEdilmeyenOran / 100) * input.spotForwardKur * input.volatilite * (input.zamanUfkuGun * input.zSkoru * input.dovizAyarlamaKlozuFaktoru); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.zamanUfkuGun * input.zSkoru * input.dovizAyarlamaKlozuFaktoru; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateTedariki_dviz_kuru_riski(input: Tedariki_dviz_kuru_riskiInput): Tedariki_dviz_kuru_riskiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Tedariki_dviz_kuru_riskiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tedariki_dviz_kuru_riskiOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

