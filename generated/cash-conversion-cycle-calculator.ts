// Auto-generated from cash-conversion-cycle-calculator-schema.json
import * as z from 'zod';

export interface Cash_conversion_cycle_calculatorInput {
  averageInventory: number;
  cogs: number;
  averageReceivables: number;
  revenue: number;
  averagePayables: number;
  daysInPeriod: number;
}

export const Cash_conversion_cycle_calculatorInputSchema = z.object({
  averageInventory: z.number().default(0),
  cogs: z.number().default(0),
  averageReceivables: z.number().default(0),
  revenue: z.number().default(0),
  averagePayables: z.number().default(0),
  daysInPeriod: z.number().default(365),
});

function evaluateAllFormulas(input: Cash_conversion_cycle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.averageInventory / input.cogs * input.daysInPeriod; results["dio"] = Number.isFinite(v) ? v : 0; } catch { results["dio"] = 0; }
  try { const v = input.averageReceivables / input.revenue * input.daysInPeriod; results["dso"] = Number.isFinite(v) ? v : 0; } catch { results["dso"] = 0; }
  try { const v = input.averagePayables / input.cogs * input.daysInPeriod; results["dpo"] = Number.isFinite(v) ? v : 0; } catch { results["dpo"] = 0; }
  try { const v = (input.averageInventory / input.cogs * input.daysInPeriod) + (input.averageReceivables / input.revenue * input.daysInPeriod) - (input.averagePayables / input.cogs * input.daysInPeriod); results["cashConversionCycle"] = Number.isFinite(v) ? v : 0; } catch { results["cashConversionCycle"] = 0; }
  return results;
}


export function calculateCash_conversion_cycle_calculator(input: Cash_conversion_cycle_calculatorInput): Cash_conversion_cycle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cashConversionCycle"] ?? 0;
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


export interface Cash_conversion_cycle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
