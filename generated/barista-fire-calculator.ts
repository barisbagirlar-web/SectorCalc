// Auto-generated from barista-fire-calculator-schema.json
import * as z from 'zod';

export interface Barista_fire_calculatorInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlySavings: number;
  annualReturn: number;
  withdrawalRate: number;
  annualExpenses: number;
  partTimeIncome: number;
}

export const Barista_fire_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  currentSavings: z.number().default(50000),
  monthlySavings: z.number().default(1000),
  annualReturn: z.number().default(7),
  withdrawalRate: z.number().default(4),
  annualExpenses: z.number().default(40000),
  partTimeIncome: z.number().default(12000),
});

function evaluateAllFormulas(input: Barista_fire_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, (input.annualExpenses - input.partTimeIncome) / (input.withdrawalRate / 100)); results["targetAmount"] = Number.isFinite(v) ? v : 0; } catch { results["targetAmount"] = 0; }
  try { const v = Math.max(0, (input.retirementAge - input.currentAge) * 12); results["monthsToRetirement"] = Number.isFinite(v) ? v : 0; } catch { results["monthsToRetirement"] = 0; }
  try { const v = Math.pow(1 + input.annualReturn / 100, 1 / 12) - 1; results["monthlyReturn"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyReturn"] = 0; }
  try { const v = input.currentSavings * Math.pow(1 + input.annualReturn / 100, Math.max(0, input.retirementAge - input.currentAge)); results["futureValueCurrent"] = Number.isFinite(v) ? v : 0; } catch { results["futureValueCurrent"] = 0; }
  try { const v = input.monthlySavings * ((Math.pow(1 + (results["monthlyReturn"] ?? 0), (results["monthsToRetirement"] ?? 0)) - 1) / Math.max(0.0001, (results["monthlyReturn"] ?? 0))); results["futureValueMonthly"] = Number.isFinite(v) ? v : 0; } catch { results["futureValueMonthly"] = 0; }
  try { const v = (results["futureValueCurrent"] ?? 0) + (results["futureValueMonthly"] ?? 0); results["totalFutureSavings"] = Number.isFinite(v) ? v : 0; } catch { results["totalFutureSavings"] = 0; }
  try { const v = ((results["targetAmount"] ?? 0) - (results["futureValueCurrent"] ?? 0)) * (Math.max(0.0001, (results["monthlyReturn"] ?? 0)) / (Math.pow(1 + (results["monthlyReturn"] ?? 0), Math.max(1, (results["monthsToRetirement"] ?? 0))) - 1)); results["monthlySavingsNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["monthlySavingsNeeded"] = 0; }
  try { const v = (results["targetAmount"] ?? 0) - (results["totalFutureSavings"] ?? 0); results["gap"] = Number.isFinite(v) ? v : 0; } catch { results["gap"] = 0; }
  return results;
}


export function calculateBarista_fire_calculator(input: Barista_fire_calculatorInput): Barista_fire_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["targetAmount"] ?? 0;
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


export interface Barista_fire_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
