// Auto-generated from chinese-new-year-calculator-schema.json
import * as z from 'zod';

export interface Chinese_new_year_calculatorInput {
  baseSalary: number;
  bonusMonths: number;
  yearsOfService: number;
  dependents: number;
  overtimeHours: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Chinese_new_year_calculatorInputSchema = z.object({
  baseSalary: z.number().default(50000),
  bonusMonths: z.number().default(1),
  yearsOfService: z.number().default(5),
  dependents: z.number().default(0),
  overtimeHours: z.number().default(0),
  taxRate: z.number().default(0.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Chinese_new_year_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseSalary * input.bonusMonths + input.yearsOfService * 500 + input.dependents * 300 + input.overtimeHours * 30; results["grossBonus"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossBonus"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossBonus"])) * input.taxRate; results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossBonus"])) - (toNumericFormulaValue(results["taxAmount"])); results["netBonus"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netBonus"] = Number.NaN; }
  return results;
}


export function calculateChinese_new_year_calculator(input: Chinese_new_year_calculatorInput): Chinese_new_year_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netBonus"]);
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


export interface Chinese_new_year_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
