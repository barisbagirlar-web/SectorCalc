// Auto-generated from takt-sure-flexibility-maliyet-schema.json
import * as z from 'zod';

export interface Takt_sure_flexibility_maliyetInput {
  AvailableTime: number;
  CustomerDemand: number;
  CycleTime_i: number;
  LaborRate: number;
  Operators: number;
  TrainingHours: number;
  TrainerRate: number;
  AnnualProduction: number;
  Demand: number;
  Capacity: number;
  OvertimeRate: number;
  IdleLaborCost: number;
  dataConfidence?: number;
}

export const Takt_sure_flexibility_maliyetInputSchema = z.object({
  AvailableTime: z.number().min(0).default(0),
  CustomerDemand: z.number().min(0).default(0),
  CycleTime_i: z.number().min(0).default(0),
  LaborRate: z.number().min(0).default(0),
  Operators: z.number().min(0).default(0),
  TrainingHours: z.number().min(0).default(0),
  TrainerRate: z.number().min(0).default(0),
  AnnualProduction: z.number().min(0).default(0),
  Demand: z.number().min(0).default(0),
  Capacity: z.number().min(0).default(0),
  OvertimeRate: z.number().min(0).default(0),
  IdleLaborCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Takt_sure_flexibility_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.AvailableTime / input.CustomerDemand; results["TaktTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TaktTime"] = Number.NaN; }
  try { const v = Math.max(input.CycleTime_i) - Math.min(input.CycleTime_i); results["CycleTimeFlexibility"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CycleTimeFlexibility"] = Number.NaN; }
  results["BalanceLoss"] = Number.NaN;
  try { const v = input.Operators * input.TrainingHours * input.TrainerRate; results["CrossTrainingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CrossTrainingCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["CrossTrainingCost"])) / input.AnnualProduction; results["FlexibilityPremium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FlexibilityPremium"] = Number.NaN; }
  try { const v = ((input.Demand > input.Capacity) ? ((input.Demand - input.Capacity) * input.OvertimeRate) : ((input.Capacity - input.Demand) * input.IdleLaborCost)); results["VolumeVariationCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VolumeVariationCost"] = Number.NaN; }
  return results;
}


export function calculateTakt_sure_flexibility_maliyet(input: Takt_sure_flexibility_maliyetInput): Takt_sure_flexibility_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["VolumeVariationCost"]);
  const breakdown = {
    TaktTime: toNumericFormulaValue(values["TaktTime"]),
    CycleTimeFlexibility: toNumericFormulaValue(values["CycleTimeFlexibility"]),
    BalanceLoss: toNumericFormulaValue(values["BalanceLoss"]),
    CrossTrainingCost: toNumericFormulaValue(values["CrossTrainingCost"]),
    FlexibilityPremium: toNumericFormulaValue(values["FlexibilityPremium"]),
    VolumeVariationCost: toNumericFormulaValue(values["VolumeVariationCost"])
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


export interface Takt_sure_flexibility_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { TaktTime: number; CycleTimeFlexibility: number; BalanceLoss: number; CrossTrainingCost: number; FlexibilityPremium: number; VolumeVariationCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Takt_sure_flexibility_maliyetOutputMeta = {
  primaryKey: "VolumeVariationCost",
  unit: "USD",
  breakdownKeys: ["TaktTime","CycleTimeFlexibility","BalanceLoss","CrossTrainingCost","FlexibilityPremium","VolumeVariationCost"],
} as const;

