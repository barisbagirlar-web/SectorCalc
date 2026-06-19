// Auto-generated from daily-compound-interest-calculator-schema.json
import * as z from 'zod';

export interface Daily_compound_interest_calculatorInput {
  principal: number;
  annualRate: number;
  timeInDays: number;
  daysInYear: number;
  dataConfidence?: number;
}

export const Daily_compound_interest_calculatorInputSchema = z.object({
  principal: z.number().default(1000),
  annualRate: z.number().default(5),
  timeInDays: z.number().default(365),
  daysInYear: z.number().default(365),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Daily_compound_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal * (1 + input.annualRate / 100 / input.daysInYear) ** input.timeInDays; results["futureValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["futureValue"] = 0; }
  try { const v = (asFormulaNumber(results["futureValue"])) - input.principal; results["totalInterest"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = ((1 + input.annualRate / 100 / input.daysInYear) ** input.daysInYear - 1) * 100; results["effectiveAnnualRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDaily_compound_interest_calculator(input: Daily_compound_interest_calculatorInput): Daily_compound_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["futureValue"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Daily_compound_interest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
