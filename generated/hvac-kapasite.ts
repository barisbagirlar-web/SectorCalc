// Auto-generated from hvac-kapasite-schema.json
import * as z from 'zod';

export interface Hvac_kapasiteInput {
  alanHacim: number;
  disIcSicaklik: number;
  uDegerleri: number;
  kisiIsik: number;
  aCH: number;
  eER: number;
  saat: number;
  tarif: number;
  dataConfidence?: number;
}

export const Hvac_kapasiteInputSchema = z.object({
  alanHacim: z.number().min(0).default(0),
  disIcSicaklik: z.number().min(0).default(0),
  uDegerleri: z.number().min(0).default(0),
  kisiIsik: z.number().min(0).default(0),
  aCH: z.number().min(0).default(0),
  eER: z.number().min(0).default(0),
  saat: z.number().min(0).default(0),
  tarif: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hvac_kapasiteInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.alanHacim * input.disIcSicaklik * input.uDegerleri * input.kisiIsik; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.alanHacim * input.disIcSicaklik * input.uDegerleri * input.kisiIsik * (input.aCH * input.eER * input.saat * input.tarif); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.aCH * input.eER * input.saat * input.tarif; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateHvac_kapasite(input: Hvac_kapasiteInput): Hvac_kapasiteOutput {
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
    unit: "units",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Hvac_kapasiteOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hvac_kapasiteOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

