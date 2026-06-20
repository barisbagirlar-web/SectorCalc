// Auto-generated from fat-fire-calculator-schema.json
import * as z from 'zod';

export interface Fat_fire_calculatorInput {
  currentAge: number;
  retirementAge: number;
  annualRetirementExpenses: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturnRate: number;
  inflationRate: number;
  safeWithdrawalRate: number;
  dataConfidence?: number;
}

export const Fat_fire_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  annualRetirementExpenses: z.number().default(100000),
  currentSavings: z.number().default(0),
  monthlyContribution: z.number().default(0),
  annualReturnRate: z.number().default(0.07),
  inflationRate: z.number().default(0.03),
  safeWithdrawalRate: z.number().default(0.04),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fat_fire_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.retirementAge - input.currentAge; results["yearsToRetirement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yearsToRetirement"] = Number.NaN; }
  try { const v = input.annualRetirementExpenses * ((1 + input.inflationRate) ** (toNumericFormulaValue(results["yearsToRetirement"]))); results["adjustedExpenses"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustedExpenses"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["adjustedExpenses"])) / input.safeWithdrawalRate; results["requiredCorpus"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredCorpus"] = Number.NaN; }
  try { const v = input.currentSavings * ((1 + input.annualReturnRate) ** (toNumericFormulaValue(results["yearsToRetirement"]))); results["futureValueCurrentSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["futureValueCurrentSavings"] = Number.NaN; }
  try { const v = (input.monthlyContribution * 12) * (((1 + input.annualReturnRate) ** (toNumericFormulaValue(results["yearsToRetirement"])) - 1) / input.annualReturnRate); results["futureValueContributions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["futureValueContributions"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["futureValueCurrentSavings"])) + (toNumericFormulaValue(results["futureValueContributions"])); results["totalSavingsAtRetirement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSavingsAtRetirement"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["requiredCorpus"])) - (toNumericFormulaValue(results["totalSavingsAtRetirement"])); results["shortfall"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shortfall"] = Number.NaN; }
  return results;
}


export function calculateFat_fire_calculator(input: Fat_fire_calculatorInput): Fat_fire_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["shortfall"]);
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


export interface Fat_fire_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
