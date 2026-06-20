// Auto-generated from insan-hayati-degeri-hesaplayici-schema.json
import * as z from 'zod';

export interface Insan_hayati_degeri_hesaplayiciInput {
  annualIncome: number;
  personalExpenseRate: number;
  currentAge: number;
  retirementAge: number;
  discountRate: number;
  incomeGrowthRate: number;
  dataConfidence?: number;
}

export const Insan_hayati_degeri_hesaplayiciInputSchema = z.object({
  annualIncome: z.number().default(100000),
  personalExpenseRate: z.number().default(30),
  currentAge: z.number().default(35),
  retirementAge: z.number().default(65),
  discountRate: z.number().default(5),
  incomeGrowthRate: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Insan_hayati_degeri_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.retirementAge - input.currentAge; results["remainingYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["remainingYears"] = Number.NaN; }
  try { const v = input.annualIncome * (1 - input.personalExpenseRate / 100); results["netAnnualContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netAnnualContribution"] = Number.NaN; }
  try { const v = input.incomeGrowthRate / 100; results["growthFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["growthFactor"] = Number.NaN; }
  try { const v = input.discountRate / 100; results["discountFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountFactor"] = Number.NaN; }
  return results;
}


export function calculateInsan_hayati_degeri_hesaplayici(input: Insan_hayati_degeri_hesaplayiciInput): Insan_hayati_degeri_hesaplayiciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["discountFactor"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Insan_hayati_degeri_hesaplayiciOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
