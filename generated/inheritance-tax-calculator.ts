// @ts-nocheck
// Auto-generated from inheritance-tax-calculator-schema.json
import * as z from 'zod';

export interface Inheritance_tax_calculatorInput {
  estateValue: number;
  funeralExpenses: number;
  debts: number;
  taxAllowance: number;
  taxRate: number;
}

export const Inheritance_tax_calculatorInputSchema = z.object({
  estateValue: z.number().default(0),
  funeralExpenses: z.number().default(0),
  debts: z.number().default(0),
  taxAllowance: z.number().default(0),
  taxRate: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Inheritance_tax_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.estateValue + input.funeralExpenses + input.debts; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.estateValue + input.funeralExpenses + input.debts; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateInheritance_tax_calculator(input: Inheritance_tax_calculatorInput): Inheritance_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Inheritance_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
