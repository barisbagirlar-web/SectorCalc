// Auto-generated from data-cap-calculator-schema.json
import * as z from 'zod';

export interface Data_cap_calculatorInput {
  monthlyDataCap: number;
  dataUsed: number;
  billingCycleDays: number;
  daysElapsed: number;
  overageFeePerGB: number;
  dataConfidence?: number;
}

export const Data_cap_calculatorInputSchema = z.object({
  monthlyDataCap: z.number().default(100),
  dataUsed: z.number().default(20),
  billingCycleDays: z.number().default(30),
  daysElapsed: z.number().default(10),
  overageFeePerGB: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Data_cap_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.daysElapsed ? input.dataUsed / input.daysElapsed : 0; results["dailyAverageUsage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyAverageUsage"] = 0; }
  try { const v = (asFormulaNumber(results["dailyAverageUsage"])) * input.billingCycleDays; results["projectedTotalUsage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["projectedTotalUsage"] = 0; }
  try { const v = input.monthlyDataCap - input.dataUsed; results["remainingData"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["remainingData"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateData_cap_calculator(input: Data_cap_calculatorInput): Data_cap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["dailyAverageUsage"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Data_cap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
