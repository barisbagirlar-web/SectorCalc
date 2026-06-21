// Auto-generated from overtime-vs-hiring-breakeven-schema.json
import * as z from 'zod';

export interface Overtime_vs_hiring_breakevenInput {
  RegularRate: number;
  OvertimeMultiplier: number;
  BurdenRate: number;
  Recruitment: number;
  Onboarding: number;
  Training: number;
  RampUpProductivityLoss: number;
  AnnualHours: number;
  Benefits: number;
  ExpectedOvertimeHours: number;
  Hire: number;
  Overtime: number;
  OvertimeHours: number;
  FatigueDefectRate: number;
  DefectCost: number;
  dataConfidence?: number;
}

export const Overtime_vs_hiring_breakevenInputSchema = z.object({
  RegularRate: z.number().min(0).default(0),
  OvertimeMultiplier: z.number().min(0).default(0),
  BurdenRate: z.number().min(0).default(0),
  Recruitment: z.number().min(0).default(0),
  Onboarding: z.number().min(0).default(0),
  Training: z.number().min(0).default(0),
  RampUpProductivityLoss: z.number().min(0).default(0),
  AnnualHours: z.number().min(0).default(0),
  Benefits: z.number().min(0).default(0),
  ExpectedOvertimeHours: z.number().min(0).default(0),
  Hire: z.number().min(0).default(0),
  Overtime: z.number().min(0).default(0),
  OvertimeHours: z.number().min(0).default(0),
  FatigueDefectRate: z.number().min(0).default(0),
  DefectCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Overtime_vs_hiring_breakevenInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.RegularRate * input.OvertimeMultiplier * (1 + input.BurdenRate); results["OvertimeCost_Hour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OvertimeCost_Hour"] = Number.NaN; }
  try { const v = input.Recruitment + input.Onboarding + input.Training + input.RampUpProductivityLoss; results["HiringCost_Total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["HiringCost_Total"] = Number.NaN; }
  try { const v = (input.RegularRate * input.AnnualHours) * (1 + input.BurdenRate) + input.Benefits; results["AnnualNewHireCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AnnualNewHireCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["HiringCost_Total"])) / ((toNumericFormulaValue(results["AnnualNewHireCost"])) / input.AnnualHours - (toNumericFormulaValue(results["OvertimeCost_Hour"]))); results["BreakevenHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BreakevenHours"] = Number.NaN; }
  try { const v = ((input.ExpectedOvertimeHours > (toNumericFormulaValue(results["BreakevenHours"]))) ? ("input.Hire") : ("input.Overtime")); results["Decision"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Decision"] = Number.NaN; }
  try { const v = input.OvertimeHours * input.FatigueDefectRate * input.DefectCost; results["QualityCost_OT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["QualityCost_OT"] = Number.NaN; }
  return results;
}


export function calculateOvertime_vs_hiring_breakeven(input: Overtime_vs_hiring_breakevenInput): Overtime_vs_hiring_breakevenOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["QualityCost_OT"]);
  const breakdown = {
    OvertimeCost_Hour: toNumericFormulaValue(values["OvertimeCost_Hour"]),
    HiringCost_Total: toNumericFormulaValue(values["HiringCost_Total"]),
    AnnualNewHireCost: toNumericFormulaValue(values["AnnualNewHireCost"]),
    BreakevenHours: toNumericFormulaValue(values["BreakevenHours"]),
    Decision: toNumericFormulaValue(values["Decision"]),
    QualityCost_OT: toNumericFormulaValue(values["QualityCost_OT"])
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


export interface Overtime_vs_hiring_breakevenOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { OvertimeCost_Hour: number; HiringCost_Total: number; AnnualNewHireCost: number; BreakevenHours: number; Decision: number; QualityCost_OT: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Overtime_vs_hiring_breakevenOutputMeta = {
  primaryKey: "QualityCost_OT",
  unit: "USD",
  breakdownKeys: ["OvertimeCost_Hour","HiringCost_Total","AnnualNewHireCost","BreakevenHours","Decision","QualityCost_OT"],
} as const;

