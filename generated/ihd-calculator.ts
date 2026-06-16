// Auto-generated from ihd-calculator-schema.json
import * as z from 'zod';

export interface Ihd_calculatorInput {
  plannedProduction: number;
  actualProduction: number;
  goodParts: number;
  totalParts: number;
}

export const Ihd_calculatorInputSchema = z.object({
  plannedProduction: z.number().default(0),
  actualProduction: z.number().default(0),
  goodParts: z.number().default(0),
  totalParts: z.number().default(0),
});

function evaluateAllFormulas(input: Ihd_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { return (input.plannedProduction && input.totalParts) ? ((input.actualProduction / input.plannedProduction) * (input.goodParts / input.totalParts) * 100).toFixed(2) : '0.00' })(); results["ihd"] = Number.isFinite(v) ? v : 0; } catch { results["ihd"] = 0; }
  try { const v = (() => { return input.plannedProduction ? ((input.actualProduction / input.plannedProduction) * 100).toFixed(2) : '0.00' })(); results["availability"] = Number.isFinite(v) ? v : 0; } catch { results["availability"] = 0; }
  try { const v = (() => { return input.totalParts ? ((input.goodParts / input.totalParts) * 100).toFixed(2) : '0.00' })(); results["quality"] = Number.isFinite(v) ? v : 0; } catch { results["quality"] = 0; }
  return results;
}


export function calculateIhd_calculator(input: Ihd_calculatorInput): Ihd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ihd"] ?? 0;
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


export interface Ihd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
