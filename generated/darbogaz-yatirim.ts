// Auto-generated from darbogaz-yatirim-schema.json
import * as z from 'zod';

export interface Darbogaz_yatirimInput {
  ActualOutput: number;
  DesignCapacity: number;
  Demand: number;
  DefectRate: number;
  AvailableTime: number;
  BottleneckCycle: number;
  UnitMargin: number;
  ThroughputIncrease: number;
  Margin: number;
  Days: number;
  UpgradeCost: number;
  MonthlyGain: number;
  dataConfidence?: number;
}

export const Darbogaz_yatirimInputSchema = z.object({
  ActualOutput: z.number().min(0).default(0),
  DesignCapacity: z.number().min(0).default(0),
  Demand: z.number().min(0).default(0),
  DefectRate: z.number().min(0).default(0),
  AvailableTime: z.number().min(0).default(0),
  BottleneckCycle: z.number().min(0).default(0),
  UnitMargin: z.number().min(0).default(0),
  ThroughputIncrease: z.number().min(0).default(0),
  Margin: z.number().min(0).default(0),
  Days: z.number().min(0).default(0),
  UpgradeCost: z.number().min(0).default(0),
  MonthlyGain: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Darbogaz_yatirimInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ActualOutput / input.DesignCapacity; results["Utilization"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Utilization"] = Number.NaN; }
  try { const v = input.Demand * (1 - input.DefectRate); results["Throughput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Throughput"] = Number.NaN; }
  try { const v = input.AvailableTime / input.Demand; results["TaktTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TaktTime"] = Number.NaN; }
  try { const v = input.BottleneckCycle - (toNumericFormulaValue(results["TaktTime"])); results["CycleTime_Gap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CycleTime_Gap"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["CycleTime_Gap"])) * input.Demand * input.UnitMargin; results["CostOfConstraint"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostOfConstraint"] = Number.NaN; }
  try { const v = (input.ThroughputIncrease * input.Margin * input.Days) / input.UpgradeCost; results["ROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI"] = Number.NaN; }
  try { const v = input.UpgradeCost / input.MonthlyGain; results["Payback"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Payback"] = Number.NaN; }
  return results;
}


export function calculateDarbogaz_yatirim(input: Darbogaz_yatirimInput): Darbogaz_yatirimOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Payback"]);
  const breakdown = {
    Utilization: toNumericFormulaValue(values["Utilization"]),
    Throughput: toNumericFormulaValue(values["Throughput"]),
    TaktTime: toNumericFormulaValue(values["TaktTime"]),
    CycleTime_Gap: toNumericFormulaValue(values["CycleTime_Gap"]),
    CostOfConstraint: toNumericFormulaValue(values["CostOfConstraint"]),
    ROI: toNumericFormulaValue(values["ROI"]),
    Payback: toNumericFormulaValue(values["Payback"])
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


export interface Darbogaz_yatirimOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Utilization: number; Throughput: number; TaktTime: number; CycleTime_Gap: number; CostOfConstraint: number; ROI: number; Payback: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Darbogaz_yatirimOutputMeta = {
  primaryKey: "Payback",
  unit: "USD",
  breakdownKeys: ["Utilization","Throughput","TaktTime","CycleTime_Gap","CostOfConstraint","ROI","Payback"],
} as const;

