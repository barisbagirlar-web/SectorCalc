// Auto-generated from insan-hayati-degeri-hesaplayici-schema.json
import * as z from 'zod';

export interface Insan_hayati_degeri_hesaplayiciInput {
  annualIncome: number;
  personalExpenseRate: number;
  currentAge: number;
  retirementAge: number;
  discountRate: number;
  incomeGrowthRate: number;
}

export const Insan_hayati_degeri_hesaplayiciInputSchema = z.object({
  annualIncome: z.number().default(100000),
  personalExpenseRate: z.number().default(30),
  currentAge: z.number().default(35),
  retirementAge: z.number().default(65),
  discountRate: z.number().default(5),
  incomeGrowthRate: z.number().default(2),
});

function evaluateAllFormulas(input: Insan_hayati_degeri_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.retirementAge - input.currentAge; results["remainingYears"] = Number.isFinite(v) ? v : 0; } catch { results["remainingYears"] = 0; }
  try { const v = input.annualIncome * (1 - input.personalExpenseRate / 100); results["netAnnualContribution"] = Number.isFinite(v) ? v : 0; } catch { results["netAnnualContribution"] = 0; }
  try { const v = input.incomeGrowthRate / 100; results["growthFactor"] = Number.isFinite(v) ? v : 0; } catch { results["growthFactor"] = 0; }
  try { const v = input.discountRate / 100; results["discountFactor"] = Number.isFinite(v) ? v : 0; } catch { results["discountFactor"] = 0; }
  try { const v = (results["growthFactor"] ?? 0) === (results["discountFactor"] ?? 0) ? input.annualIncome * (results["remainingYears"] ?? 0) / (1 + (results["discountFactor"] ?? 0)) : input.annualIncome * (1 - Math.pow((1 + (results["growthFactor"] ?? 0)) / (1 + (results["discountFactor"] ?? 0)), (results["remainingYears"] ?? 0))) / ((results["discountFactor"] ?? 0) - (results["growthFactor"] ?? 0)); results["totalIncomePV"] = Number.isFinite(v) ? v : 0; } catch { results["totalIncomePV"] = 0; }
  try { const v = (results["totalIncomePV"] ?? 0) * (input.personalExpenseRate / 100); results["totalExpensePV"] = Number.isFinite(v) ? v : 0; } catch { results["totalExpensePV"] = 0; }
  try { const v = (results["totalIncomePV"] ?? 0) - (results["totalExpensePV"] ?? 0); results["hlv"] = Number.isFinite(v) ? v : 0; } catch { results["hlv"] = 0; }
  return results;
}


export function calculateInsan_hayati_degeri_hesaplayici(input: Insan_hayati_degeri_hesaplayiciInput): Insan_hayati_degeri_hesaplayiciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["İnsan Hayatı Değeri (HLV)"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
