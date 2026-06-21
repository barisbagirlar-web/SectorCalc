// Auto-generated from saatlik-ucret-schema.json
import * as z from 'zod';

export interface Saatlik_ucretInput {
  BaseSalary: number;
  Bonuses: number;
  TaxRate: number;
  HealthInsurance: number;
  RetirementMatch: number;
  PaidTimeOffCost: number;
  WeeksPerYear: number;
  VacationWeeks: number;
  HoursPerWeek: number;
  IdleTimePct: number;
  TargetMargin: number;
  dataConfidence?: number;
}

export const Saatlik_ucretInputSchema = z.object({
  BaseSalary: z.number().min(0).default(0),
  Bonuses: z.number().min(0).default(0),
  TaxRate: z.number().min(0).default(0),
  HealthInsurance: z.number().min(0).default(0),
  RetirementMatch: z.number().min(0).default(0),
  PaidTimeOffCost: z.number().min(0).default(0),
  WeeksPerYear: z.number().min(0).default(0),
  VacationWeeks: z.number().min(0).default(0),
  HoursPerWeek: z.number().min(0).default(0),
  IdleTimePct: z.number().min(0).default(0),
  TargetMargin: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Saatlik_ucretInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.BaseSalary + input.Bonuses; results["GrossAnnualSalary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["GrossAnnualSalary"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["GrossAnnualSalary"])) * input.TaxRate; results["EmployerTaxes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EmployerTaxes"] = Number.NaN; }
  try { const v = input.HealthInsurance + input.RetirementMatch + input.PaidTimeOffCost; results["Benefits"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Benefits"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["GrossAnnualSalary"])) + (toNumericFormulaValue(results["EmployerTaxes"])) + (toNumericFormulaValue(results["Benefits"])); results["TotalLaborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalLaborCost"] = Number.NaN; }
  try { const v = (input.WeeksPerYear - input.VacationWeeks) * input.HoursPerWeek * (1 - input.IdleTimePct); results["ProductiveHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ProductiveHours"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalLaborCost"])) / (toNumericFormulaValue(results["ProductiveHours"])); results["FullyBurdenedHourlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FullyBurdenedHourlyRate"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["FullyBurdenedHourlyRate"])) * (1 + input.TargetMargin); results["MarginRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MarginRate"] = Number.NaN; }
  return results;
}


export function calculateSaatlik_ucret(input: Saatlik_ucretInput): Saatlik_ucretOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["MarginRate"]);
  const breakdown = {
    GrossAnnualSalary: toNumericFormulaValue(values["GrossAnnualSalary"]),
    EmployerTaxes: toNumericFormulaValue(values["EmployerTaxes"]),
    Benefits: toNumericFormulaValue(values["Benefits"]),
    TotalLaborCost: toNumericFormulaValue(values["TotalLaborCost"]),
    ProductiveHours: toNumericFormulaValue(values["ProductiveHours"]),
    FullyBurdenedHourlyRate: toNumericFormulaValue(values["FullyBurdenedHourlyRate"]),
    MarginRate: toNumericFormulaValue(values["MarginRate"])
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


export interface Saatlik_ucretOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { GrossAnnualSalary: number; EmployerTaxes: number; Benefits: number; TotalLaborCost: number; ProductiveHours: number; FullyBurdenedHourlyRate: number; MarginRate: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Saatlik_ucretOutputMeta = {
  primaryKey: "MarginRate",
  unit: "USD",
  breakdownKeys: ["GrossAnnualSalary","EmployerTaxes","Benefits","TotalLaborCost","ProductiveHours","FullyBurdenedHourlyRate","MarginRate"],
} as const;

