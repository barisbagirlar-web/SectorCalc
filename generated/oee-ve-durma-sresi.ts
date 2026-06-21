// Auto-generated from oee-ve-durma-sresi-schema.json
import * as z from 'zod';

export interface Oee_ve_durma_sresiInput {
  planliGercek_CalismaSuresi: number;
  Ideal_Cevrim: number;
  toplamSaglamAdet: number;
  dakikaBasinaDurusMaliyeti: number;
  birimMaliyet: number;
  takvimSuresiAllTime: number;
  dataConfidence?: number;
}

export const Oee_ve_durma_sresiInputSchema = z.object({
  planliGercek_CalismaSuresi: z.number().min(0).default(0),
  Ideal_Cevrim: z.number().min(0).default(0),
  toplamSaglamAdet: z.number().min(0).default(0),
  dakikaBasinaDurusMaliyeti: z.number().min(0).default(0),
  birimMaliyet: z.number().min(0).default(0),
  takvimSuresiAllTime: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Oee_ve_durma_sresiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.planliGercek_CalismaSuresi * input.Ideal_Cevrim * input.toplamSaglamAdet * input.dakikaBasinaDurusMaliyeti; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.planliGercek_CalismaSuresi * input.Ideal_Cevrim * input.toplamSaglamAdet * input.dakikaBasinaDurusMaliyeti * (input.birimMaliyet * input.takvimSuresiAllTime); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.birimMaliyet * input.takvimSuresiAllTime; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateOee_ve_durma_sresi(input: Oee_ve_durma_sresiInput): Oee_ve_durma_sresiOutput {
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


export interface Oee_ve_durma_sresiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Oee_ve_durma_sresiOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

