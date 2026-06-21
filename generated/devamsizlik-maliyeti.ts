// Auto-generated from devamsizlik-maliyeti-schema.json
import * as z from 'zod';

export interface Devamsizlik_maliyetiInput {
  AbsentHours: number;
  HourlyRate: number;
  Burden: number;
  ReplaceOT: number;
  OTRate: number;
  RegRate: number;
  TempHours: number;
  TempRate: number;
  Markup: number;
  OutputPerHour: number;
  Margin: number;
  EffDrop: number;
  Events: number;
  HR_Time: number;
  HRRate: number;
  S: number;
  D: number;
  Direct: number;
  OT: number;
  Temp: number;
  Prod: number;
  Admin: number;
  dataConfidence?: number;
}

export const Devamsizlik_maliyetiInputSchema = z.object({
  AbsentHours: z.number().min(0).default(0),
  HourlyRate: z.number().min(0).default(0),
  Burden: z.number().min(0).default(0),
  ReplaceOT: z.number().min(0).default(0),
  OTRate: z.number().min(0).default(0),
  RegRate: z.number().min(0).default(0),
  TempHours: z.number().min(0).default(0),
  TempRate: z.number().min(0).default(0),
  Markup: z.number().min(0).default(0),
  OutputPerHour: z.number().min(0).default(0),
  Margin: z.number().min(0).default(0),
  EffDrop: z.number().min(0).default(0),
  Events: z.number().min(0).default(0),
  HR_Time: z.number().min(0).default(0),
  HRRate: z.number().min(0).default(0),
  S: z.number().min(0).default(0),
  D: z.number().min(0).default(0),
  Direct: z.number().min(0).default(0),
  OT: z.number().min(0).default(0),
  Temp: z.number().min(0).default(0),
  Prod: z.number().min(0).default(0),
  Admin: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Devamsizlik_maliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.AbsentHours * input.HourlyRate * (1 + input.Burden); results["DirectCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DirectCost"] = Number.NaN; }
  try { const v = input.ReplaceOT * (input.OTRate - input.RegRate); results["OvertimePremium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OvertimePremium"] = Number.NaN; }
  try { const v = input.TempHours * input.TempRate * (1 + input.Markup); results["TempCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TempCost"] = Number.NaN; }
  try { const v = input.AbsentHours * input.OutputPerHour * input.Margin * input.EffDrop; results["ProdLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ProdLoss"] = Number.NaN; }
  try { const v = input.Events * input.HR_Time * input.HRRate; results["AdminCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AdminCost"] = Number.NaN; }
  try { const v = input.S**2 * input.D; results["BradfordFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BradfordFactor"] = Number.NaN; }
  try { const v = input.Direct + input.OT + input.Temp + input.Prod + input.Admin; results["TotalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalCost"] = Number.NaN; }
  return results;
}


export function calculateDevamsizlik_maliyeti(input: Devamsizlik_maliyetiInput): Devamsizlik_maliyetiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalCost"]);
  const breakdown = {
    DirectCost: toNumericFormulaValue(values["DirectCost"]),
    OvertimePremium: toNumericFormulaValue(values["OvertimePremium"]),
    TempCost: toNumericFormulaValue(values["TempCost"]),
    ProdLoss: toNumericFormulaValue(values["ProdLoss"]),
    AdminCost: toNumericFormulaValue(values["AdminCost"]),
    BradfordFactor: toNumericFormulaValue(values["BradfordFactor"]),
    TotalCost: toNumericFormulaValue(values["TotalCost"])
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


export interface Devamsizlik_maliyetiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { DirectCost: number; OvertimePremium: number; TempCost: number; ProdLoss: number; AdminCost: number; BradfordFactor: number; TotalCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Devamsizlik_maliyetiOutputMeta = {
  primaryKey: "TotalCost",
  unit: "USD",
  breakdownKeys: ["DirectCost","OvertimePremium","TempCost","ProdLoss","AdminCost","BradfordFactor","TotalCost"],
} as const;

