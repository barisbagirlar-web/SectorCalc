// Auto-generated from compound-interest-calculator-schema.json
import * as z from 'zod';

export interface Compound_interest_calculatorInput {
  principal: number;
  annualInterestRate: number;
  compoundingFrequency: string;
  timePeriod: number;
  additionalContribution: number;
  inflationRate: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Compound_interest_calculatorInputSchema = z.object({
  principal: z.number().min(0).max(1000000000).default(10000),
  annualInterestRate: z.number().min(0).max(100).default(5),
  compoundingFrequency: z.enum(['1', '2', '4', '12', '52', '365']).default('12'),
  timePeriod: z.number().min(0).max(100).default(10),
  additionalContribution: z.number().min(0).max(100000000).default(0),
  inflationRate: z.number().min(0).max(100).default(2),
  taxRate: z.number().min(0).max(100).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Compound_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal * (1 + input.annualInterestRate / 100 / input.compoundingFrequency) ** (input.compoundingFrequency * input.timePeriod) + input.additionalContribution * (((1 + input.annualInterestRate / 100 / input.compoundingFrequency) ** (input.compoundingFrequency * input.timePeriod) - 1) / (input.annualInterestRate / 100 / input.compoundingFrequency)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["result"])) / (1 + input.inflationRate / 100) ** input.timePeriod; results["realValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["realValue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["result"])) - ((toNumericFormulaValue(results["result"])) - input.principal - input.additionalContribution * input.compoundingFrequency * input.timePeriod) * input.taxRate / 100; results["afterTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["afterTax"] = Number.NaN; }
  return results;
}


export function calculateCompound_interest_calculator(input: Compound_interest_calculatorInput): Compound_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Inflation erosion of purchasing power","Tax drag on compound growth"];
  const suggestedActions: string[] = ["Increase compounding frequency to daily","Invest in tax-advantaged accounts"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario comparison","Sensitivity analysis"],
  };
}


export interface Compound_interest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
