// Auto-generated from inheritance-tax-calculator-schema.json
import * as z from 'zod';

export interface Inheritance_tax_calculatorInput {
  estateValue: number;
  funeralExpenses: number;
  debts: number;
  taxAllowance: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Inheritance_tax_calculatorInputSchema = z.object({
  estateValue: z.number().default(0),
  funeralExpenses: z.number().default(0),
  debts: z.number().default(0),
  taxAllowance: z.number().default(0),
  taxRate: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Inheritance_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.estateValue * input.funeralExpenses * input.debts * input.taxAllowance; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.estateValue * input.funeralExpenses * input.debts * input.taxAllowance * ((input.taxRate / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (input.taxRate / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateInheritance_tax_calculator(input: Inheritance_tax_calculatorInput): Inheritance_tax_calculatorOutput {
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
