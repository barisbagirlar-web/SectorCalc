// Auto-generated from isi-exchanger-fouling-schema.json
import * as z from 'zod';

export interface Isi_exchanger_foulingInput {
  ucleandirty: number;
  alan: number;
  lMTD: number;
  dPArtis: number;
  temizlik: number;
  yakit: number;
  kazanVerim: number;
  dataConfidence?: number;
}

export const Isi_exchanger_foulingInputSchema = z.object({
  ucleandirty: z.number().min(0).default(0),
  alan: z.number().min(0).default(0),
  lMTD: z.number().min(0).default(0),
  dPArtis: z.number().min(0).default(0),
  temizlik: z.number().min(0).default(0),
  yakit: z.number().min(0).default(0),
  kazanVerim: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Isi_exchanger_foulingInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ucleandirty * input.alan * input.lMTD * input.dPArtis; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.ucleandirty * input.alan * input.lMTD * input.dPArtis * (input.temizlik * input.yakit * input.kazanVerim); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.temizlik * input.yakit * input.kazanVerim; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateIsi_exchanger_fouling(input: Isi_exchanger_foulingInput): Isi_exchanger_foulingOutput {
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


export interface Isi_exchanger_foulingOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Isi_exchanger_foulingOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

