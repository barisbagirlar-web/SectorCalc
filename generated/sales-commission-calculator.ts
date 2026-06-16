// Auto-generated from sales-commission-calculator-schema.json
import * as z from 'zod';

export interface Sales_commission_calculatorInput {
  totalSales: number;
  commissionRate: number;
  targetSales: number;
  bonusRate: number;
  baseSalary: number;
}

export const Sales_commission_calculatorInputSchema = z.object({
  totalSales: z.number().default(5000),
  commissionRate: z.number().default(5),
  targetSales: z.number().default(10000),
  bonusRate: z.number().default(2),
  baseSalary: z.number().default(2000),
});

function evaluateAllFormulas(input: Sales_commission_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseSalary; results["baseSalaryOutput"] = Number.isFinite(v) ? v : 0; } catch { results["baseSalaryOutput"] = 0; }
  try { const v = input.totalSales * (input.commissionRate / 100); results["commission"] = Number.isFinite(v) ? v : 0; } catch { results["commission"] = 0; }
  try { const v = (input.totalSales > input.targetSales) * (input.totalSales - input.targetSales) * (input.bonusRate / 100); results["bonus"] = Number.isFinite(v) ? v : 0; } catch { results["bonus"] = 0; }
  try { const v = input.baseSalary + input.totalSales * (input.commissionRate / 100) + (input.totalSales > input.targetSales) * (input.totalSales - input.targetSales) * (input.bonusRate / 100); results["totalCompensation"] = Number.isFinite(v) ? v : 0; } catch { results["totalCompensation"] = 0; }
  return results;
}


export function calculateSales_commission_calculator(input: Sales_commission_calculatorInput): Sales_commission_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCompensation"] ?? 0;
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


export interface Sales_commission_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
