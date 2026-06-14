// Auto-generated from cloud-api-cost-overrun-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CloudApiCostOverrunInput {
  monthlyApiCalls: number;
  costPerCall: number;
  budgetedMonthlyCost: number;
  dataConfidence: 'low' | 'medium' | 'high';
  overrunThreshold: number;
}

export const CloudApiCostOverrunInputSchema = z.object({
  monthlyApiCalls: z.number().min(0).default(1000000),
  costPerCall: z.number().min(0).default(0.0001),
  budgetedMonthlyCost: z.number().min(0).default(100),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
  overrunThreshold: z.number().min(0).max(100).default(10),
});

export interface CloudApiCostOverrunOutput {
  overrunAmount: number;
  breakdown: {
    actualMonthlyCost: number;
    budgetedMonthlyCost: number;
    overrunPercent: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CloudApiCostOverrunInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.actualMonthlyCost = (() => { try { return input.monthlyApiCalls * input.costPerCall; } catch { return 0; } })();
  results.overrunAmount = (() => { try { return results.actualMonthlyCost - input.budgetedMonthlyCost; } catch { return 0; } })();
  results.overrunPercent = (() => { try { return (results.overrunAmount / input.budgetedMonthlyCost) * 100; } catch { return 0; } })();
  results.dataConfidenceFactor = (() => { try { return input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9); } catch { return 0; } })();
  results.adjustedOverrunAmount = (() => { try { return results.overrunAmount * results.dataConfidenceFactor; } catch { return 0; } })();
  return results;
}

export function calculateCloudApiCostOverrun(input: CloudApiCostOverrunInput): CloudApiCostOverrunOutput {
  const results = evaluateFormulas(input);
  const overrunAmount = results.overrunAmount ?? 0;
  const breakdown = {
    actualMonthlyCost: results.actualMonthlyCost,
    budgetedMonthlyCost: results.budgetedMonthlyCost,
    overrunPercent: results.overrunPercent,
  };

  // rule: monthlyApiCalls >= 0
  // rule: costPerCall >= 0
  // rule: budgetedMonthlyCost > 0
  // rule: overrunThreshold >= 0 && overrunThreshold <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (overrunPercent > input.overrunThreshold) hiddenLossDrivers.push("Overrun threshold exceeded");

  const dataConfidenceAdjusted = (() => { try { return results.adjustedOverrunAmount; } catch { return overrunAmount; } })();

  return {
    overrunAmount,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Historical Data","Detailed Report with Breakdown"],
  };
}
