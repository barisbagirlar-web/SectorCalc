// @ts-nocheck
// Auto-generated from rule-of-115-calculator-schema.json
import * as z from 'zod';

export interface Rule_of_115_calculatorInput {
  interestRate: number;
  taxRate: number;
  compoundingFrequency: number;
  principal: number;
}

export const Rule_of_115_calculatorInputSchema = z.object({
  interestRate: z.number().default(8),
  taxRate: z.number().default(0),
  compoundingFrequency: z.number().default(1),
  principal: z.number().default(1000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rule_of_115_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 115 / (input.interestRate * (1 - input.taxRate/100)); results["yearsRule115"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["yearsRule115"] = 0; }
  try { const v = input.principal * 3; results["targetAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["targetAmount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRule_of_115_calculator(input: Rule_of_115_calculatorInput): Rule_of_115_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["yearsRule115"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Rule_of_115_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
