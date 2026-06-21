// Auto-generated from muda-atk-maliyet-schema.json
import * as z from 'zod';

export interface Muda_atk_maliyetInput {
  asiri_UretimAdedi: number;
  beklemeHareketSuresi: number;
  tasimaMesafesiSefer: number;
  fazla_IslemSuresi: number;
  hataliAdet: number;
  birimStokTasimaIscilikMaliyetleri: number;
  dataConfidence?: number;
}

export const Muda_atk_maliyetInputSchema = z.object({
  asiri_UretimAdedi: z.number().min(0).default(0),
  beklemeHareketSuresi: z.number().min(0).default(0),
  tasimaMesafesiSefer: z.number().min(0).default(0),
  fazla_IslemSuresi: z.number().min(0).default(0),
  hataliAdet: z.number().min(0).default(0),
  birimStokTasimaIscilikMaliyetleri: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Muda_atk_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.asiri_UretimAdedi * input.beklemeHareketSuresi * input.tasimaMesafesiSefer * input.fazla_IslemSuresi; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.asiri_UretimAdedi * input.beklemeHareketSuresi * input.tasimaMesafesiSefer * input.fazla_IslemSuresi * (input.hataliAdet * input.birimStokTasimaIscilikMaliyetleri); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.hataliAdet * input.birimStokTasimaIscilikMaliyetleri; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateMuda_atk_maliyet(input: Muda_atk_maliyetInput): Muda_atk_maliyetOutput {
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


export interface Muda_atk_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Muda_atk_maliyetOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

