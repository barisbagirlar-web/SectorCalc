// Auto-generated from project-overrun-risk-schema.json
import * as z from 'zod';

export interface Project_overrun_riskInput {
  EarnedValue: number;
  PlannedValue: number;
  ActualCost: number;
  BudgetAtCompletion: number;
  ActualDuration: number;
  PlannedDuration: number;
  ProbabilityOfDelay: number;
  DelayDays: number;
  DailyPenalty: number;
  ProbabilityOfCostOverrun: number;
  CrashingCost: number;
  FastTrackingCost: number;
  dataConfidence?: number;
}

export const Project_overrun_riskInputSchema = z.object({
  EarnedValue: z.number().min(0).default(0),
  PlannedValue: z.number().min(0).default(0),
  ActualCost: z.number().min(0).default(0),
  BudgetAtCompletion: z.number().min(0).default(0),
  ActualDuration: z.number().min(0).default(0),
  PlannedDuration: z.number().min(0).default(0),
  ProbabilityOfDelay: z.number().min(0).default(0),
  DelayDays: z.number().min(0).default(0),
  DailyPenalty: z.number().min(0).default(0),
  ProbabilityOfCostOverrun: z.number().min(0).default(0),
  CrashingCost: z.number().min(0).default(0),
  FastTrackingCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Project_overrun_riskInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.EarnedValue / input.PlannedValue; results["SPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SPI"] = Number.NaN; }
  try { const v = input.EarnedValue / input.ActualCost; results["CPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CPI"] = Number.NaN; }
  try { const v = input.BudgetAtCompletion / (toNumericFormulaValue(results["CPI"])); results["EAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EAC"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["EAC"])) - input.BudgetAtCompletion; results["ExpectedOverrun"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ExpectedOverrun"] = Number.NaN; }
  try { const v = (input.ActualDuration - input.PlannedDuration) / input.PlannedDuration; results["ScheduleDelay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ScheduleDelay"] = Number.NaN; }
  try { const v = input.ProbabilityOfDelay * (input.DelayDays * input.DailyPenalty) + input.ProbabilityOfCostOverrun * (toNumericFormulaValue(results["ExpectedOverrun"])); results["RiskExposure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RiskExposure"] = Number.NaN; }
  try { const v = input.CrashingCost + input.FastTrackingCost; results["MitigationCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MitigationCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["RiskExposure"])) - (toNumericFormulaValue(results["MitigationCost"])); results["NetRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NetRisk"] = Number.NaN; }
  return results;
}


export function calculateProject_overrun_risk(input: Project_overrun_riskInput): Project_overrun_riskOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["NetRisk"]);
  const breakdown = {
    SPI: toNumericFormulaValue(values["SPI"]),
    CPI: toNumericFormulaValue(values["CPI"]),
    EAC: toNumericFormulaValue(values["EAC"]),
    ExpectedOverrun: toNumericFormulaValue(values["ExpectedOverrun"]),
    ScheduleDelay: toNumericFormulaValue(values["ScheduleDelay"]),
    RiskExposure: toNumericFormulaValue(values["RiskExposure"]),
    MitigationCost: toNumericFormulaValue(values["MitigationCost"]),
    NetRisk: toNumericFormulaValue(values["NetRisk"])
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


export interface Project_overrun_riskOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { SPI: number; CPI: number; EAC: number; ExpectedOverrun: number; ScheduleDelay: number; RiskExposure: number; MitigationCost: number; NetRisk: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Project_overrun_riskOutputMeta = {
  primaryKey: "NetRisk",
  unit: "USD",
  breakdownKeys: ["SPI","CPI","EAC","ExpectedOverrun","ScheduleDelay","RiskExposure","MitigationCost","NetRisk"],
} as const;

