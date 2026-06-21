// Auto-generated from diki-hatti-dengeleyici-schema.json
import * as z from 'zod';

export interface Diki_hatti_dengeleyiciInput {
  sMVSureleri: number;
  vardiyaDurus: number;
  hedefAdet: number;
  operator: number;
  hedefVerim: number;
  hata: number;
  dataConfidence?: number;
}

export const Diki_hatti_dengeleyiciInputSchema = z.object({
  sMVSureleri: z.number().min(0).default(0),
  vardiyaDurus: z.number().min(0).default(0),
  hedefAdet: z.number().min(0).default(0),
  operator: z.number().min(0).default(0),
  hedefVerim: z.number().min(0).default(0),
  hata: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Diki_hatti_dengeleyiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sMVSureleri * input.vardiyaDurus * input.hedefAdet * input.operator; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.sMVSureleri * input.vardiyaDurus * input.hedefAdet * input.operator * (input.hedefVerim * input.hata); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.hedefVerim * input.hata; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateDiki_hatti_dengeleyici(input: Diki_hatti_dengeleyiciInput): Diki_hatti_dengeleyiciOutput {
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


export interface Diki_hatti_dengeleyiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Diki_hatti_dengeleyiciOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

