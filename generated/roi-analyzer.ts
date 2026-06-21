// Auto-generated from roi-analyzer-schema.json
import * as z from 'zod';

export interface Roi_analyzerInput {
  netIncome: number;
  revenue: number;
  totalAssets: number;
  totalEquity: number;
  expectedRevenue: number;
  expectedLoss: number;
  operatingCost: number;
  economicCapital: number;
  nopat: number;
  investedCapital: number;
  wacc: number;
  dataConfidence?: number;
}

export const Roi_analyzerInputSchema = z.object({
  netIncome: z.number().min(0).default(0),
  revenue: z.number().min(0).default(0),
  totalAssets: z.number().min(0).default(0),
  totalEquity: z.number().min(0).default(0),
  expectedRevenue: z.number().min(0).default(0),
  expectedLoss: z.number().min(0).default(0),
  operatingCost: z.number().min(0).default(0),
  economicCapital: z.number().min(0).default(0),
  nopat: z.number().min(0).default(0),
  investedCapital: z.number().min(0).default(0),
  wacc: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Roi_analyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netIncome * input.revenue * input.totalAssets * input.totalEquity; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.netIncome * input.revenue * input.totalAssets * input.totalEquity * (input.expectedRevenue * input.expectedLoss * input.operatingCost * input.economicCapital * input.nopat * input.investedCapital * (input.wacc / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.expectedRevenue * input.expectedLoss * input.operatingCost * input.economicCapital * input.nopat * input.investedCapital * (input.wacc / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateRoi_analyzer(input: Roi_analyzerInput): Roi_analyzerOutput {
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


export interface Roi_analyzerOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Roi_analyzerOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

