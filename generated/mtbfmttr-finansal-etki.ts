// Auto-generated from mtbfmttr-finansal-etki-schema.json
import * as z from 'zod';

export interface Mtbfmttr_finansal_etkiInput {
  MTBF: number;
  MTTR: number;
  TotalTime: number;
  CostPerHour: number;
  LaborRate: number;
  PartsCost: number;
  OldCost: number;
  NewCost: number;
  InvestmentCost: number;
  TargetAvailability: number;
  dataConfidence?: number;
}

export const Mtbfmttr_finansal_etkiInputSchema = z.object({
  MTBF: z.number().min(0).default(0),
  MTTR: z.number().min(0).default(0),
  TotalTime: z.number().min(0).default(0),
  CostPerHour: z.number().min(0).default(0),
  LaborRate: z.number().min(0).default(0),
  PartsCost: z.number().min(0).default(0),
  OldCost: z.number().min(0).default(0),
  NewCost: z.number().min(0).default(0),
  InvestmentCost: z.number().min(0).default(0),
  TargetAvailability: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mtbfmttr_finansal_etkiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.MTBF / (input.MTBF + input.MTTR); results["Availability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Availability"] = Number.NaN; }
  try { const v = input.TotalTime * (1 - (toNumericFormulaValue(results["Availability"]))); results["ExpectedDowntime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ExpectedDowntime"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ExpectedDowntime"])) * input.CostPerHour; results["DowntimeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DowntimeCost"] = Number.NaN; }
  try { const v = input.TotalTime / input.MTBF; results["FailureFrequency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FailureFrequency"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["FailureFrequency"])) * (input.MTTR * input.LaborRate + input.PartsCost); results["RepairCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RepairCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["DowntimeCost"])) + (toNumericFormulaValue(results["RepairCost"])); results["TotalReliabilityCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalReliabilityCost"] = Number.NaN; }
  try { const v = (input.OldCost - input.NewCost) / input.InvestmentCost; results["ROI_Improvement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI_Improvement"] = Number.NaN; }
  try { const v = -input.TotalTime / Math.log(input.TargetAvailability); results["TargetMTBF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TargetMTBF"] = Number.NaN; }
  return results;
}


export function calculateMtbfmttr_finansal_etki(input: Mtbfmttr_finansal_etkiInput): Mtbfmttr_finansal_etkiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TargetMTBF"]);
  const breakdown = {
    Availability: toNumericFormulaValue(values["Availability"]),
    ExpectedDowntime: toNumericFormulaValue(values["ExpectedDowntime"]),
    DowntimeCost: toNumericFormulaValue(values["DowntimeCost"]),
    FailureFrequency: toNumericFormulaValue(values["FailureFrequency"]),
    RepairCost: toNumericFormulaValue(values["RepairCost"]),
    TotalReliabilityCost: toNumericFormulaValue(values["TotalReliabilityCost"]),
    ROI_Improvement: toNumericFormulaValue(values["ROI_Improvement"]),
    TargetMTBF: toNumericFormulaValue(values["TargetMTBF"])
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


export interface Mtbfmttr_finansal_etkiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Availability: number; ExpectedDowntime: number; DowntimeCost: number; FailureFrequency: number; RepairCost: number; TotalReliabilityCost: number; ROI_Improvement: number; TargetMTBF: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Mtbfmttr_finansal_etkiOutputMeta = {
  primaryKey: "TargetMTBF",
  unit: "USD",
  breakdownKeys: ["Availability","ExpectedDowntime","DowntimeCost","FailureFrequency","RepairCost","TotalReliabilityCost","ROI_Improvement","TargetMTBF"],
} as const;

