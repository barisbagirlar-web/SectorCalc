// Auto-generated from enerji-tketim-raporu-schema.json
import * as z from 'zod';

export interface Enerji_tketim_raporuInput {
  aktifT0T3: number;
  reaktif: number;
  demax: number;
  pFHedef: number;
  cezaEsik: number;
  aktifReaktifGucBedeli: number;
  karbon: number;
  dataConfidence?: number;
}

export const Enerji_tketim_raporuInputSchema = z.object({
  aktifT0T3: z.number().min(0).default(0),
  reaktif: z.number().min(0).default(0),
  demax: z.number().min(0).default(0),
  pFHedef: z.number().min(0).default(0),
  cezaEsik: z.number().min(0).default(0),
  aktifReaktifGucBedeli: z.number().min(0).default(0),
  karbon: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Enerji_tketim_raporuInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.aktifT0T3 * input.reaktif * input.demax * input.pFHedef; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.aktifT0T3 * input.reaktif * input.demax * input.pFHedef * (input.cezaEsik * input.aktifReaktifGucBedeli * input.karbon); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.cezaEsik * input.aktifReaktifGucBedeli * input.karbon; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateEnerji_tketim_raporu(input: Enerji_tketim_raporuInput): Enerji_tketim_raporuOutput {
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


export interface Enerji_tketim_raporuOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Enerji_tketim_raporuOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

