// @ts-nocheck
// Auto-generated from data-cap-calculator-schema.json
import * as z from 'zod';

export interface Data_cap_calculatorInput {
  monthlyDataCap: number;
  dataUsed: number;
  billingCycleDays: number;
  daysElapsed: number;
  overageFeePerGB: number;
}

export const Data_cap_calculatorInputSchema = z.object({
  monthlyDataCap: z.number().default(100),
  dataUsed: z.number().default(20),
  billingCycleDays: z.number().default(30),
  daysElapsed: z.number().default(10),
  overageFeePerGB: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Data_cap_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.daysElapsed ? input.dataUsed / input.daysElapsed : 0; results["dailyAverageUsage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dailyAverageUsage"] = 0; }
  try { const v = (asFormulaNumber(results["dailyAverageUsage"])) * input.billingCycleDays; results["projectedTotalUsage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["projectedTotalUsage"] = 0; }
  try { const v = input.monthlyDataCap - input.dataUsed; results["remainingData"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["remainingData"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateData_cap_calculator(input: Data_cap_calculatorInput): Data_cap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyAverageUsage"]);
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


export interface Data_cap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
