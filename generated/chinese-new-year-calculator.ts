// Auto-generated from chinese-new-year-calculator-schema.json
import * as z from 'zod';

export interface Chinese_new_year_calculatorInput {
  baseSalary: number;
  bonusMonths: number;
  yearsOfService: number;
  dependents: number;
  overtimeHours: number;
  taxRate: number;
}

export const Chinese_new_year_calculatorInputSchema = z.object({
  baseSalary: z.number().default(50000),
  bonusMonths: z.number().default(1),
  yearsOfService: z.number().default(5),
  dependents: z.number().default(0),
  overtimeHours: z.number().default(0),
  taxRate: z.number().default(0.2),
});

function evaluateAllFormulas(input: Chinese_new_year_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseSalary * input.bonusMonths + input.yearsOfService * 500 + input.dependents * 300 + input.overtimeHours * 30; results["grossBonus"] = Number.isFinite(v) ? v : 0; } catch { results["grossBonus"] = 0; }
  try { const v = (results["grossBonus"] ?? 0) * input.taxRate; results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["grossBonus"] ?? 0) - (results["taxAmount"] ?? 0); results["netBonus"] = Number.isFinite(v) ? v : 0; } catch { results["netBonus"] = 0; }
  return results;
}


export function calculateChinese_new_year_calculator(input: Chinese_new_year_calculatorInput): Chinese_new_year_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netBonus"] ?? 0;
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


export interface Chinese_new_year_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
