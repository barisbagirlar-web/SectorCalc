// Auto-generated from yg-ve-nbd-schema.json
import * as z from 'zod';

export interface Yg_ve_nbdInput {
  IlkYatirim: number;
  yillikNakitAkislariArray: number;
  proje_OmruYil: number;
  IskontoOraniWACC: number;
  hedefROI: number;
  dataConfidence?: number;
}

export const Yg_ve_nbdInputSchema = z.object({
  IlkYatirim: z.number().min(0).default(0),
  yillikNakitAkislariArray: z.number().min(0).default(0),
  proje_OmruYil: z.number().min(0).default(0),
  IskontoOraniWACC: z.number().min(0).default(0),
  hedefROI: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yg_ve_nbdInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.IlkYatirim * input.yillikNakitAkislariArray * input.proje_OmruYil * (input.IskontoOraniWACC / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.IlkYatirim * input.yillikNakitAkislariArray * input.proje_OmruYil * (input.IskontoOraniWACC / 100) * (input.hedefROI); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.hedefROI; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateYg_ve_nbd(input: Yg_ve_nbdInput): Yg_ve_nbdOutput {
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


export interface Yg_ve_nbdOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yg_ve_nbdOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

