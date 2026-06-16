// Auto-generated from rpe-calculator-schema.json
import * as z from 'zod';

export interface Rpe_calculatorInput {
  coRev: number;
  coEmp: number;
  indRev: number;
  indEmp: number;
}

export const Rpe_calculatorInputSchema = z.object({
  coRev: z.number().default(1000000),
  coEmp: z.number().default(50),
  indRev: z.number().default(5000000),
  indEmp: z.number().default(100),
});

function evaluateAllFormulas(input: Rpe_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coRev / input.coEmp; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateRpe_calculator(input: Rpe_calculatorInput): Rpe_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Your"] ?? 0;
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


export interface Rpe_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
