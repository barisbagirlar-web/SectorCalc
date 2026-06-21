// Auto-generated from vsm-finansal-dntrc-schema.json
import * as z from 'zod';

export interface Vsm_finansal_dntrcInput {
  toplamLeadTimeGun: number;
  katmaDegerliSureDk: number;
  wIPStokDegeri: number;
  gunlukTasimaMaliyeti: number;
  eskiYeni_CevrimSuresiDk: number;
  yillikHacim: number;
  kalite_IyilestirmeTasarrufu: number;
  dataConfidence?: number;
}

export const Vsm_finansal_dntrcInputSchema = z.object({
  toplamLeadTimeGun: z.number().min(0).default(0),
  katmaDegerliSureDk: z.number().min(0).default(0),
  wIPStokDegeri: z.number().min(0).default(0),
  gunlukTasimaMaliyeti: z.number().min(0).default(0),
  eskiYeni_CevrimSuresiDk: z.number().min(0).default(0),
  yillikHacim: z.number().min(0).default(0),
  kalite_IyilestirmeTasarrufu: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vsm_finansal_dntrcInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.toplamLeadTimeGun * input.katmaDegerliSureDk * input.wIPStokDegeri * input.gunlukTasimaMaliyeti; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.toplamLeadTimeGun * input.katmaDegerliSureDk * input.wIPStokDegeri * input.gunlukTasimaMaliyeti * (input.eskiYeni_CevrimSuresiDk * input.yillikHacim * input.kalite_IyilestirmeTasarrufu); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.eskiYeni_CevrimSuresiDk * input.yillikHacim * input.kalite_IyilestirmeTasarrufu; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateVsm_finansal_dntrc(input: Vsm_finansal_dntrcInput): Vsm_finansal_dntrcOutput {
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


export interface Vsm_finansal_dntrcOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Vsm_finansal_dntrcOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

