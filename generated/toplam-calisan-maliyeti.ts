// Auto-generated from toplam-calisan-maliyeti-schema.json
import * as z from 'zod';

export interface Toplam_calisan_maliyetiInput {
  BasePay: number;
  Bonuses: number;
  Overtime: number;
  SocialSecurity: number;
  Unemployment: number;
  Taxes: number;
  HealthInsurance: number;
  Retirement: number;
  Meals: number;
  Transport: number;
  AbsentHours: number;
  FullyBurdenedRate: number;
  Recruitment: number;
  Training: number;
  TurnoverRate: number;
  ProductiveHours: number;
  dataConfidence?: number;
}

export const Toplam_calisan_maliyetiInputSchema = z.object({
  BasePay: z.number().min(0).default(0),
  Bonuses: z.number().min(0).default(0),
  Overtime: z.number().min(0).default(0),
  SocialSecurity: z.number().min(0).default(0),
  Unemployment: z.number().min(0).default(0),
  Taxes: z.number().min(0).default(0),
  HealthInsurance: z.number().min(0).default(0),
  Retirement: z.number().min(0).default(0),
  Meals: z.number().min(0).default(0),
  Transport: z.number().min(0).default(0),
  AbsentHours: z.number().min(0).default(0),
  FullyBurdenedRate: z.number().min(0).default(0),
  Recruitment: z.number().min(0).default(0),
  Training: z.number().min(0).default(0),
  TurnoverRate: z.number().min(0).default(0),
  ProductiveHours: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Toplam_calisan_maliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.BasePay + input.Bonuses + input.Overtime; results["GrossSalary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["GrossSalary"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["GrossSalary"])) * (input.SocialSecurity + input.Unemployment + input.Taxes); results["StatutoryCosts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["StatutoryCosts"] = Number.NaN; }
  try { const v = input.HealthInsurance + input.Retirement + input.Meals + input.Transport; results["Benefits"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Benefits"] = Number.NaN; }
  try { const v = input.AbsentHours * input.FullyBurdenedRate; results["AbsenteeismCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AbsenteeismCost"] = Number.NaN; }
  try { const v = (input.Recruitment + input.Training) * input.TurnoverRate; results["TurnoverCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TurnoverCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["GrossSalary"])) + (toNumericFormulaValue(results["StatutoryCosts"])) + (toNumericFormulaValue(results["Benefits"])) + (toNumericFormulaValue(results["AbsenteeismCost"])) + (toNumericFormulaValue(results["TurnoverCost"])); results["TotalEmployeeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalEmployeeCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalEmployeeCost"])) / input.ProductiveHours; results["CostPerHour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerHour"] = Number.NaN; }
  return results;
}


export function calculateToplam_calisan_maliyeti(input: Toplam_calisan_maliyetiInput): Toplam_calisan_maliyetiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CostPerHour"]);
  const breakdown = {
    GrossSalary: toNumericFormulaValue(values["GrossSalary"]),
    StatutoryCosts: toNumericFormulaValue(values["StatutoryCosts"]),
    Benefits: toNumericFormulaValue(values["Benefits"]),
    AbsenteeismCost: toNumericFormulaValue(values["AbsenteeismCost"]),
    TurnoverCost: toNumericFormulaValue(values["TurnoverCost"]),
    TotalEmployeeCost: toNumericFormulaValue(values["TotalEmployeeCost"]),
    CostPerHour: toNumericFormulaValue(values["CostPerHour"])
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


export interface Toplam_calisan_maliyetiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { GrossSalary: number; StatutoryCosts: number; Benefits: number; AbsenteeismCost: number; TurnoverCost: number; TotalEmployeeCost: number; CostPerHour: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Toplam_calisan_maliyetiOutputMeta = {
  primaryKey: "CostPerHour",
  unit: "USD",
  breakdownKeys: ["GrossSalary","StatutoryCosts","Benefits","AbsenteeismCost","TurnoverCost","TotalEmployeeCost","CostPerHour"],
} as const;

