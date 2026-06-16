// Auto-generated from dots-calculator-schema.json
import * as z from 'zod';

export interface Dots_calculatorInput {
  regularHours: number;
  overtimeHours: number;
  regularRate: number;
  overtimeMultiplier: number;
}

export const Dots_calculatorInputSchema = z.object({
  regularHours: z.number().default(8),
  overtimeHours: z.number().default(2),
  regularRate: z.number().default(50),
  overtimeMultiplier: z.number().default(1.5),
});

function evaluateAllFormulas(input: Dots_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.regularHours * input.regularRate + input.overtimeHours * input.regularRate * input.overtimeMultiplier; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.regularHours * input.regularRate; results["regularPay"] = Number.isFinite(v) ? v : 0; } catch { results["regularPay"] = 0; }
  try { const v = input.overtimeHours * input.regularRate * input.overtimeMultiplier; results["overtimePay"] = Number.isFinite(v) ? v : 0; } catch { results["overtimePay"] = 0; }
  return results;
}


export function calculateDots_calculator(input: Dots_calculatorInput): Dots_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Total"] ?? 0;
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


export interface Dots_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
