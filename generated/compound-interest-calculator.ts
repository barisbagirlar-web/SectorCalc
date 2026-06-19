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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Compound_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal * input.annualInterestRate * input.timePeriod * input.additionalContribution; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.principal * input.annualInterestRate * input.timePeriod * input.additionalContribution * (input.inflationRate * input.taxRate); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.inflationRate * input.taxRate; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCompound_interest_calculator(input: Compound_interest_calculatorInput): Compound_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
