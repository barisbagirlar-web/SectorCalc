// Auto-generated from haccp-deviation-schema.json
import * as z from 'zod';

export interface Haccp_deviationInput {
  karantinaHacim: number;
  bekletme: number;
  test: number;
  reworkImha: number;
  geri_Cagirma: number;
  ceza: number;
  dataConfidence?: number;
}

export const Haccp_deviationInputSchema = z.object({
  karantinaHacim: z.number().min(0).default(0),
  bekletme: z.number().min(0).default(0),
  test: z.number().min(0).default(0),
  reworkImha: z.number().min(0).default(0),
  geri_Cagirma: z.number().min(0).default(0),
  ceza: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Haccp_deviationInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.karantinaHacim * input.bekletme * input.test * input.reworkImha; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.karantinaHacim * input.bekletme * input.test * input.reworkImha * (input.geri_Cagirma * input.ceza); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.geri_Cagirma * input.ceza; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateHaccp_deviation(input: Haccp_deviationInput): Haccp_deviationOutput {
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


export interface Haccp_deviationOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Haccp_deviationOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

