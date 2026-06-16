// Auto-generated from interval-calculator-schema.json
import * as z from 'zod';

export interface Interval_calculatorInput {
  nominal: number;
  plusTol: number;
  minusTol: number;
  scaleFactor: number;
}

export const Interval_calculatorInputSchema = z.object({
  nominal: z.number().default(100),
  plusTol: z.number().default(0.1),
  minusTol: z.number().default(0.05),
  scaleFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Interval_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.scaleFactor * (input.nominal + input.plusTol); results["upper_limit"] = Number.isFinite(v) ? v : 0; } catch { results["upper_limit"] = 0; }
  try { const v = input.scaleFactor * (input.nominal - input.minusTol); results["lower_limit"] = Number.isFinite(v) ? v : 0; } catch { results["lower_limit"] = 0; }
  try { const v = input.scaleFactor * (input.plusTol + input.minusTol); results["tolerance_range"] = Number.isFinite(v) ? v : 0; } catch { results["tolerance_range"] = 0; }
  try { const v = input.scaleFactor * (input.nominal + (input.plusTol - input.minusTol) / 2); results["midpoint"] = Number.isFinite(v) ? v : 0; } catch { results["midpoint"] = 0; }
  return results;
}


export function calculateInterval_calculator(input: Interval_calculatorInput): Interval_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tolerance_range"] ?? 0;
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


export interface Interval_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
