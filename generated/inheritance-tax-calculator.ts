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

function evaluateAllFormulas(input: Inheritance_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, input.estateValue - input.funeralExpenses - input.debts - input.taxAllowance); results["taxableEstate"] = Number.isFinite(v) ? v : 0; } catch { results["taxableEstate"] = 0; }
  try { const v = (results["taxableEstate"] ?? 0) * (input.taxRate / 100); results["inheritanceTax"] = Number.isFinite(v) ? v : 0; } catch { results["inheritanceTax"] = 0; }
  return results;
}


export function calculateInheritance_tax_calculator(input: Inheritance_tax_calculatorInput): Inheritance_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["inheritanceTax"] ?? 0;
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


export interface Inheritance_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
