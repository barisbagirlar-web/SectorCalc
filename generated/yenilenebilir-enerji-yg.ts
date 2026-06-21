// Auto-generated from yenilenebilir-enerji-yg-schema.json
import * as z from 'zod';

export interface Yenilenebilir_enerji_ygInput {
  kuruluGucKW: number;
  kapasiteFaktoru: number;
  sistem_OmruYil: number;
  capex: number;
  wACC: number;
  SebekeElektrikFiyatiCurrencykWh: number;
  yillikBakimSigorta: number;
  tesvikler: number;
  dataConfidence?: number;
}

export const Yenilenebilir_enerji_ygInputSchema = z.object({
  kuruluGucKW: z.number().min(0).default(0),
  kapasiteFaktoru: z.number().min(0).default(0),
  sistem_OmruYil: z.number().min(0).default(0),
  capex: z.number().min(0).default(0),
  wACC: z.number().min(0).default(0),
  SebekeElektrikFiyatiCurrencykWh: z.number().min(0).default(0),
  yillikBakimSigorta: z.number().min(0).default(0),
  tesvikler: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yenilenebilir_enerji_ygInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kuruluGucKW * input.kapasiteFaktoru * input.sistem_OmruYil * input.capex; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.kuruluGucKW * input.kapasiteFaktoru * input.sistem_OmruYil * input.capex * (input.wACC * input.SebekeElektrikFiyatiCurrencykWh * input.yillikBakimSigorta * input.tesvikler); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.wACC * input.SebekeElektrikFiyatiCurrencykWh * input.yillikBakimSigorta * input.tesvikler; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateYenilenebilir_enerji_yg(input: Yenilenebilir_enerji_ygInput): Yenilenebilir_enerji_ygOutput {
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


export interface Yenilenebilir_enerji_ygOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yenilenebilir_enerji_ygOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

