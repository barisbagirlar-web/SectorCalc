// Auto-generated from emergency-fund-calculator-schema.json
import * as z from 'zod';

export interface Emergency_fund_calculatorInput {
  monthlyExpenses: number;
  coverageMonths: number;
  currentSavings: number;
  safetyMargin: number;
}

export const Emergency_fund_calculatorInputSchema = z.object({
  monthlyExpenses: z.number().default(2000),
  coverageMonths: z.number().default(6),
  currentSavings: z.number().default(0),
  safetyMargin: z.number().default(10),
});

function evaluateAllFormulas(input: Emergency_fund_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyExpenses * input.coverageMonths * (1 + input.safetyMargin / 100); results["totalEmergencyFund"] = Number.isFinite(v) ? v : 0; } catch { results["totalEmergencyFund"] = 0; }
  try { const v = input.monthlyExpenses * input.coverageMonths * (input.safetyMargin / 100); results["safetyMarginAmount"] = Number.isFinite(v) ? v : 0; } catch { results["safetyMarginAmount"] = 0; }
  try { const v = input.monthlyExpenses !== 0 ? input.currentSavings / (input.monthlyExpenses * (1 + input.safetyMargin / 100)) : 0; results["monthsCoveredByCurrent"] = Number.isFinite(v) ? v : 0; } catch { results["monthsCoveredByCurrent"] = 0; }
  try { const v = Math.max(0, (results["totalEmergencyFund"] ?? 0) - input.currentSavings); results["additionalSavingsNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["additionalSavingsNeeded"] = 0; }
  return results;
}


export function calculateEmergency_fund_calculator(input: Emergency_fund_calculatorInput): Emergency_fund_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["additionalSavingsNeeded"] ?? 0;
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


export interface Emergency_fund_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
