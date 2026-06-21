// Auto-generated from baaba-noktasi-schema.json
import * as z from 'zod';

export interface Baaba_noktasiInput {
  sabitMaliyetler: number;
  birimDegiskenMaliyet: number;
  birimFiyat: number;
  guncelHacim: number;
  guncelGelir: number;
  hedefKar: number;
  dataConfidence?: number;
}

export const Baaba_noktasiInputSchema = z.object({
  sabitMaliyetler: z.number().min(0).default(0),
  birimDegiskenMaliyet: z.number().min(0).default(0),
  birimFiyat: z.number().min(0).default(0),
  guncelHacim: z.number().min(0).default(0),
  guncelGelir: z.number().min(0).default(0),
  hedefKar: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Baaba_noktasiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sabitMaliyetler * input.birimDegiskenMaliyet * input.birimFiyat * input.guncelHacim; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.sabitMaliyetler * input.birimDegiskenMaliyet * input.birimFiyat * input.guncelHacim * (input.guncelGelir * input.hedefKar); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.guncelGelir * input.hedefKar; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateBaaba_noktasi(input: Baaba_noktasiInput): Baaba_noktasiOutput {
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


export interface Baaba_noktasiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Baaba_noktasiOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

