// Auto-generated from fiyat-esneklii-schema.json
import * as z from 'zod';

export interface Fiyat_esnekliiInput {
  mevcutFiyatTalep: number;
  degisim: number;
  esneklik: number;
  CaprazEsneklik: number;
  degiskenSabitMaliyet: number;
  dataConfidence?: number;
}

export const Fiyat_esnekliiInputSchema = z.object({
  mevcutFiyatTalep: z.number().min(0).default(0),
  degisim: z.number().min(0).default(0),
  esneklik: z.number().min(0).default(0),
  CaprazEsneklik: z.number().min(0).default(0),
  degiskenSabitMaliyet: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fiyat_esnekliiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mevcutFiyatTalep * input.degisim * input.esneklik * input.CaprazEsneklik; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.mevcutFiyatTalep * input.degisim * input.esneklik * input.CaprazEsneklik * (input.degiskenSabitMaliyet); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.degiskenSabitMaliyet; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateFiyat_esneklii(input: Fiyat_esnekliiInput): Fiyat_esnekliiOutput {
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


export interface Fiyat_esnekliiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fiyat_esnekliiOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

