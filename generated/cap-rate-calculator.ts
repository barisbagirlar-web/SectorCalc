// Auto-generated from cap-rate-calculator-schema.json
import * as z from 'zod';

export interface Cap_rate_calculatorInput {
  propertyValue: number;
  annualGrossIncome: number;
  annualOperatingExpenses: number;
  vacancyRate: number;
  otherAnnualIncome: number;
  dataConfidence?: number;
}

export const Cap_rate_calculatorInputSchema = z.object({
  propertyValue: z.number().default(500000),
  annualGrossIncome: z.number().default(60000),
  annualOperatingExpenses: z.number().default(15000),
  vacancyRate: z.number().default(5),
  otherAnnualIncome: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cap_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualGrossIncome * (1 - input.vacancyRate / 100) + input.otherAnnualIncome; results["effectiveGrossIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveGrossIncome"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveGrossIncome"])) - input.annualOperatingExpenses; results["netOperatingIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netOperatingIncome"] = 0; }
  try { const v = (asFormulaNumber(results["netOperatingIncome"])) / input.propertyValue * 100; results["capRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["capRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCap_rate_calculator(input: Cap_rate_calculatorInput): Cap_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["capRate"]));
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


export interface Cap_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
