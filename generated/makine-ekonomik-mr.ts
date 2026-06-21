// Auto-generated from makine-ekonomik-mr-schema.json
import * as z from 'zod';

export interface Makine_ekonomik_mrInput {
  IlkMaliyetPiyasaDegeri: number;
  kalintiDeger: number;
  yillik_IsletmeBakimMaliyetleri: number;
  IskontoOraniI: number;
  analizPeriyoduN: number;
  yeniMakineTeklifi: number;
  dataConfidence?: number;
}

export const Makine_ekonomik_mrInputSchema = z.object({
  IlkMaliyetPiyasaDegeri: z.number().min(0).default(0),
  kalintiDeger: z.number().min(0).default(0),
  yillik_IsletmeBakimMaliyetleri: z.number().min(0).default(0),
  IskontoOraniI: z.number().min(0).default(0),
  analizPeriyoduN: z.number().min(0).default(0),
  yeniMakineTeklifi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Makine_ekonomik_mrInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.IlkMaliyetPiyasaDegeri * input.kalintiDeger * input.yillik_IsletmeBakimMaliyetleri * (input.IskontoOraniI / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.IlkMaliyetPiyasaDegeri * input.kalintiDeger * input.yillik_IsletmeBakimMaliyetleri * (input.IskontoOraniI / 100) * (input.analizPeriyoduN * input.yeniMakineTeklifi); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.analizPeriyoduN * input.yeniMakineTeklifi; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateMakine_ekonomik_mr(input: Makine_ekonomik_mrInput): Makine_ekonomik_mrOutput {
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


export interface Makine_ekonomik_mrOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Makine_ekonomik_mrOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

