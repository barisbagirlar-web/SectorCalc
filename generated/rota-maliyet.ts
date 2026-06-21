// Auto-generated from rota-maliyet-schema.json
import * as z from 'zod';

export interface Rota_maliyetInput {
  toplamMesafeSure: number;
  yakitTuketimFiyat: number;
  surucu_Ucreti: number;
  otoyolKopruGecisleri: number;
  bakimKmMaliyeti: number;
  amortismanVeOverhead: number;
  dataConfidence?: number;
}

export const Rota_maliyetInputSchema = z.object({
  toplamMesafeSure: z.number().min(0).default(0),
  yakitTuketimFiyat: z.number().min(0).default(0),
  surucu_Ucreti: z.number().min(0).default(0),
  otoyolKopruGecisleri: z.number().min(0).default(0),
  bakimKmMaliyeti: z.number().min(0).default(0),
  amortismanVeOverhead: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rota_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.toplamMesafeSure * input.yakitTuketimFiyat * input.surucu_Ucreti * input.otoyolKopruGecisleri; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.toplamMesafeSure * input.yakitTuketimFiyat * input.surucu_Ucreti * input.otoyolKopruGecisleri * (input.bakimKmMaliyeti * input.amortismanVeOverhead); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.bakimKmMaliyeti * input.amortismanVeOverhead; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateRota_maliyet(input: Rota_maliyetInput): Rota_maliyetOutput {
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Rota_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Rota_maliyetOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

