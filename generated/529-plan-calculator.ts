// Auto-generated from 529-plan-calculator-schema.json
import * as z from 'zod';

export interface _529_plan_calculatorInput {
  childAge: number;
  annualContribution: number;
  existingBalance: number;
  yearsUntilCollege: number;
  annualReturn: number;
  inflationRate: number;
}

export const _529_plan_calculatorInputSchema = z.object({
  childAge: z.number().default(5),
  annualContribution: z.number().default(5000),
  existingBalance: z.number().default(10000),
  yearsUntilCollege: z.number().default(13),
  annualReturn: z.number().default(6),
  inflationRate: z.number().default(2),
});

function evaluateAllFormulas(input: _529_plan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualReturn / 100; results["rate"] = Number.isFinite(v) ? v : 0; } catch { results["rate"] = 0; }
  try { const v = input.existingBalance * (1 + (results["rate"] ?? 0)) ** input.yearsUntilCollege; results["fvExisting"] = Number.isFinite(v) ? v : 0; } catch { results["fvExisting"] = 0; }
  try { const v = input.annualContribution * (((1 + (results["rate"] ?? 0)) ** input.yearsUntilCollege - 1) / (results["rate"] ?? 0)); results["fvContributions"] = Number.isFinite(v) ? v : 0; } catch { results["fvContributions"] = 0; }
  try { const v = (results["fvExisting"] ?? 0) + (results["fvContributions"] ?? 0); results["projectedBalance"] = Number.isFinite(v) ? v : 0; } catch { results["projectedBalance"] = 0; }
  try { const v = input.existingBalance + input.annualContribution * input.yearsUntilCollege; results["totalContributions"] = Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = (results["projectedBalance"] ?? 0) - (results["totalContributions"] ?? 0); results["totalEarnings"] = Number.isFinite(v) ? v : 0; } catch { results["totalEarnings"] = 0; }
  return results;
}


export function calculate_529_plan_calculator(input: _529_plan_calculatorInput): _529_plan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["projectedBalance"] ?? 0;
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


export interface _529_plan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
