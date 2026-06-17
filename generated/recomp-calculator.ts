// Auto-generated from recomp-calculator-schema.json
import * as z from 'zod';

export interface Recomp_calculatorInput {
  baseAmount: number;
  rate: number;
  time: number;
  expenses: number;
  adjustmentFactor: number;
}

export const Recomp_calculatorInputSchema = z.object({
  baseAmount: z.number().default(1000),
  rate: z.number().default(5),
  time: z.number().default(12),
  expenses: z.number().default(0),
  adjustmentFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Recomp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseAmount * (input.rate / 100) * (input.time / 12); results["interestAmount"] = Number.isFinite(v) ? v : 0; } catch { results["interestAmount"] = 0; }
  try { const v = input.baseAmount + (results["interestAmount"] ?? 0) + input.expenses; results["totalBeforeAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["totalBeforeAdjustment"] = 0; }
  try { const v = (results["totalBeforeAdjustment"] ?? 0) * input.adjustmentFactor; results["totalCompensation"] = Number.isFinite(v) ? v : 0; } catch { results["totalCompensation"] = 0; }
  return results;
}


export function calculateRecomp_calculator(input: Recomp_calculatorInput): Recomp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCompensation"] ?? 0;
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


export interface Recomp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
