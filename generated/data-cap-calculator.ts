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

function evaluateAllFormulas(input: Data_cap_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.daysElapsed ? input.dataUsed / input.daysElapsed : 0; results["dailyAverageUsage"] = Number.isFinite(v) ? v : 0; } catch { results["dailyAverageUsage"] = 0; }
  try { const v = (results["dailyAverageUsage"] ?? 0) * input.billingCycleDays; results["projectedTotalUsage"] = Number.isFinite(v) ? v : 0; } catch { results["projectedTotalUsage"] = 0; }
  try { const v = Math.max(0, (results["projectedTotalUsage"] ?? 0) - input.monthlyDataCap); results["overageData"] = Number.isFinite(v) ? v : 0; } catch { results["overageData"] = 0; }
  try { const v = (results["overageData"] ?? 0) * input.overageFeePerGB; results["estimatedOverageCost"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedOverageCost"] = 0; }
  try { const v = input.monthlyDataCap - input.dataUsed; results["remainingData"] = Number.isFinite(v) ? v : 0; } catch { results["remainingData"] = 0; }
  return results;
}


export function calculateData_cap_calculator(input: Data_cap_calculatorInput): Data_cap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["estimatedOverageCost"] ?? 0;
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


export interface Data_cap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
