// Auto-generated from ciro-maliyeti-schema.json
import * as z from 'zod';

export interface Ciro_maliyetiInput {
  ExitInterview: number;
  HRRate: number;
  Severance: number;
  Admin: number;
  TimeToFill: number;
  DailyRevenue: number;
  TempCost: number;
  Ads: number;
  Agency: number;
  InterviewTime: number;
  TrainHours: number;
  TrainerRate: number;
  OnboardHours: number;
  NewHireRate: number;
  TimeToFull: number;
  AvgOutput: number;
  RampUp: number;
  Margin: number;
  Separation: number;
  Vacancy: number;
  Replacement: number;
  Training: number;
  Productivity: number;
  dataConfidence?: number;
}

export const Ciro_maliyetiInputSchema = z.object({
  ExitInterview: z.number().min(0).default(0),
  HRRate: z.number().min(0).default(0),
  Severance: z.number().min(0).default(0),
  Admin: z.number().min(0).default(0),
  TimeToFill: z.number().min(0).default(0),
  DailyRevenue: z.number().min(0).default(0),
  TempCost: z.number().min(0).default(0),
  Ads: z.number().min(0).default(0),
  Agency: z.number().min(0).default(0),
  InterviewTime: z.number().min(0).default(0),
  TrainHours: z.number().min(0).default(0),
  TrainerRate: z.number().min(0).default(0),
  OnboardHours: z.number().min(0).default(0),
  NewHireRate: z.number().min(0).default(0),
  TimeToFull: z.number().min(0).default(0),
  AvgOutput: z.number().min(0).default(0),
  RampUp: z.number().min(0).default(0),
  Margin: z.number().min(0).default(0),
  Separation: z.number().min(0).default(0),
  Vacancy: z.number().min(0).default(0),
  Replacement: z.number().min(0).default(0),
  Training: z.number().min(0).default(0),
  Productivity: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ciro_maliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ExitInterview * input.HRRate + input.Severance + input.Admin; results["SeparationCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SeparationCost"] = Number.NaN; }
  try { const v = (input.TimeToFill * input.DailyRevenue) + input.TempCost; results["VacancyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VacancyCost"] = Number.NaN; }
  results["ReplacementCost"] = Number.NaN;
  try { const v = input.TrainHours * input.TrainerRate + input.OnboardHours * input.NewHireRate; results["TrainingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TrainingCost"] = Number.NaN; }
  try { const v = input.TimeToFull * input.AvgOutput * (1 - input.RampUp) * input.Margin; results["ProductivityLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ProductivityLoss"] = Number.NaN; }
  try { const v = input.Separation + input.Vacancy + input.Replacement + input.Training + input.Productivity; results["TotalTurnoverCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalTurnoverCost"] = Number.NaN; }
  return results;
}


export function calculateCiro_maliyeti(input: Ciro_maliyetiInput): Ciro_maliyetiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalTurnoverCost"]);
  const breakdown = {
    SeparationCost: toNumericFormulaValue(values["SeparationCost"]),
    VacancyCost: toNumericFormulaValue(values["VacancyCost"]),
    ReplacementCost: toNumericFormulaValue(values["ReplacementCost"]),
    TrainingCost: toNumericFormulaValue(values["TrainingCost"]),
    ProductivityLoss: toNumericFormulaValue(values["ProductivityLoss"]),
    TotalTurnoverCost: toNumericFormulaValue(values["TotalTurnoverCost"])
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


export interface Ciro_maliyetiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { SeparationCost: number; VacancyCost: number; ReplacementCost: number; TrainingCost: number; ProductivityLoss: number; TotalTurnoverCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ciro_maliyetiOutputMeta = {
  primaryKey: "TotalTurnoverCost",
  unit: "USD",
  breakdownKeys: ["SeparationCost","VacancyCost","ReplacementCost","TrainingCost","ProductivityLoss","TotalTurnoverCost"],
} as const;

