// Auto-generated from sozlesme-tesvik-schema.json
import * as z from 'zod';

export interface Sozlesme_tesvikInput {
  BaselineEstimate: number;
  TargetFeePct: number;
  OverrunShare: number;
  UnderrunShare: number;
  ActualCost: number;
  ContractorSharePct: number;
  MaxFeeMultiplier: number;
  MinFeeMultiplier: number;
  MetricWeight_i: number;
  MetricScore_i: number;
  BonusPool: number;
  dataConfidence?: number;
}

export const Sozlesme_tesvikInputSchema = z.object({
  BaselineEstimate: z.number().min(0).default(0),
  TargetFeePct: z.number().min(0).default(0),
  OverrunShare: z.number().min(0).default(0),
  UnderrunShare: z.number().min(0).default(0),
  ActualCost: z.number().min(0).default(0),
  ContractorSharePct: z.number().min(0).default(0),
  MaxFeeMultiplier: z.number().min(0).default(0),
  MinFeeMultiplier: z.number().min(0).default(0),
  MetricWeight_i: z.number().min(0).default(0),
  MetricScore_i: z.number().min(0).default(0),
  BonusPool: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sozlesme_tesvikInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.BaselineEstimate; results["TargetCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TargetCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TargetCost"])) * input.TargetFeePct; results["TargetFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TargetFee"] = Number.NaN; }
  try { const v = input.OverrunShare / input.UnderrunShare; results["ShareRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ShareRatio"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TargetFee"])) + ((toNumericFormulaValue(results["TargetCost"])) - input.ActualCost) * input.ContractorSharePct; results["ActualFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ActualFee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TargetFee"])) * input.MaxFeeMultiplier; results["MaxFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MaxFee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TargetFee"])) * input.MinFeeMultiplier; results["MinFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MinFee"] = Number.NaN; }
  try { const v = Math.min(Math.max((toNumericFormulaValue(results["ActualFee"])), (toNumericFormulaValue(results["MinFee"]))), (toNumericFormulaValue(results["MaxFee"]))); results["FinalFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FinalFee"] = Number.NaN; }
  try { const v = input.ActualCost + (toNumericFormulaValue(results["FinalFee"])); results["FinalPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FinalPrice"] = Number.NaN; }
  results["PerformanceBonus"] = Number.NaN;
  return results;
}


export function calculateSozlesme_tesvik(input: Sozlesme_tesvikInput): Sozlesme_tesvikOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["PerformanceBonus"]);
  const breakdown = {
    TargetCost: toNumericFormulaValue(values["TargetCost"]),
    TargetFee: toNumericFormulaValue(values["TargetFee"]),
    ShareRatio: toNumericFormulaValue(values["ShareRatio"]),
    ActualFee: toNumericFormulaValue(values["ActualFee"]),
    MaxFee: toNumericFormulaValue(values["MaxFee"]),
    MinFee: toNumericFormulaValue(values["MinFee"]),
    FinalFee: toNumericFormulaValue(values["FinalFee"]),
    FinalPrice: toNumericFormulaValue(values["FinalPrice"]),
    PerformanceBonus: toNumericFormulaValue(values["PerformanceBonus"])
  };
  const hiddenLossDrivers: string[] = ["Verify assumptions with real data","Cross-check with industry benchmarks"];
  const suggestedActions: string[] = ["Run sensitivity analysis","Review assumptions with domain expert"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report","Action plan"],
  };
}


export interface Sozlesme_tesvikOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { TargetCost: number; TargetFee: number; ShareRatio: number; ActualFee: number; MaxFee: number; MinFee: number; FinalFee: number; FinalPrice: number; PerformanceBonus: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sozlesme_tesvikOutputMeta = {
  primaryKey: "PerformanceBonus",
  unit: "USD",
  breakdownKeys: ["TargetCost","TargetFee","ShareRatio","ActualFee","MaxFee","MinFee","FinalFee","FinalPrice","PerformanceBonus"],
} as const;

