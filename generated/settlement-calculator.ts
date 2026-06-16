// Auto-generated from settlement-calculator-schema.json
import * as z from 'zod';

export interface Settlement_calculatorInput {
  grossMonthlySalary: number;
  yearsOfService: number;
  unusedLeaveDays: number;
  noticePeriodDays: number;
}

export const Settlement_calculatorInputSchema = z.object({
  grossMonthlySalary: z.number().default(5000),
  yearsOfService: z.number().default(5),
  unusedLeaveDays: z.number().default(10),
  noticePeriodDays: z.number().default(30),
});

function evaluateAllFormulas(input: Settlement_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossMonthlySalary * input.yearsOfService; results["severancePay"] = Number.isFinite(v) ? v : 0; } catch { results["severancePay"] = 0; }
  try { const v = (input.grossMonthlySalary / 30) * input.noticePeriodDays; results["noticePay"] = Number.isFinite(v) ? v : 0; } catch { results["noticePay"] = 0; }
  try { const v = (input.grossMonthlySalary / 30) * input.unusedLeaveDays; results["leaveEncashment"] = Number.isFinite(v) ? v : 0; } catch { results["leaveEncashment"] = 0; }
  try { const v = input.grossMonthlySalary * input.yearsOfService + (input.grossMonthlySalary / 30) * input.noticePeriodDays + (input.grossMonthlySalary / 30) * input.unusedLeaveDays; results["totalSettlement"] = Number.isFinite(v) ? v : 0; } catch { results["totalSettlement"] = 0; }
  return results;
}


export function calculateSettlement_calculator(input: Settlement_calculatorInput): Settlement_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSettlement"] ?? 0;
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


export interface Settlement_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
