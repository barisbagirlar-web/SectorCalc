// Auto-generated from retention-rate-calculator-schema.json
import * as z from 'zod';

export interface Retention_rate_calculatorInput {
  customersStart: number;
  customersEnd: number;
  newCustomers: number;
  periodDays: number;
}

export const Retention_rate_calculatorInputSchema = z.object({
  customersStart: z.number().default(1000),
  customersEnd: z.number().default(900),
  newCustomers: z.number().default(200),
  periodDays: z.number().default(30),
});

function evaluateAllFormulas(input: Retention_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.customersEnd - input.newCustomers; results["retainedCustomers"] = Number.isFinite(v) ? v : 0; } catch { results["retainedCustomers"] = 0; }
  try { const v = input.customersStart > 0 ? ((input.customersEnd - input.newCustomers) / input.customersStart) * 100 : 0; results["retentionRate"] = Number.isFinite(v) ? v : 0; } catch { results["retentionRate"] = 0; }
  try { const v = input.customersStart > 0 ? 100 - ((input.customersEnd - input.newCustomers) / input.customersStart) * 100 : 0; results["churnRate"] = Number.isFinite(v) ? v : 0; } catch { results["churnRate"] = 0; }
  return results;
}


export function calculateRetention_rate_calculator(input: Retention_rate_calculatorInput): Retention_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["retentionRate"] ?? 0;
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


export interface Retention_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
