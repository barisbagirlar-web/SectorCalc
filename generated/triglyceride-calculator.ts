// Auto-generated from triglyceride-calculator-schema.json
import * as z from 'zod';

export interface Triglyceride_calculatorInput {
  fa_moles: number;
  fa_mw: number;
  glycerol_moles: number;
  glycerol_mw: number;
  yield_percent: number;
}

export const Triglyceride_calculatorInputSchema = z.object({
  fa_moles: z.number().default(3),
  fa_mw: z.number().default(282.47),
  glycerol_moles: z.number().default(1),
  glycerol_mw: z.number().default(92.09),
  yield_percent: z.number().default(95),
});

function evaluateAllFormulas(input: Triglyceride_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(input.fa_moles / 3, input.glycerol_moles) * (3 * input.fa_mw + input.glycerol_mw - 3 * 18.015); results["theoretical_mass"] = Number.isFinite(v) ? v : 0; } catch { results["theoretical_mass"] = 0; }
  try { const v = Math.min(input.fa_moles / 3, input.glycerol_moles) * 3 * 18.015; results["water_mass"] = Number.isFinite(v) ? v : 0; } catch { results["water_mass"] = 0; }
  try { const v = (results["theoretical_mass"] ?? 0) * input.yield_percent / 100; results["actual_triglyceride_mass"] = Number.isFinite(v) ? v : 0; } catch { results["actual_triglyceride_mass"] = 0; }
  return results;
}


export function calculateTriglyceride_calculator(input: Triglyceride_calculatorInput): Triglyceride_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["actual_triglyceride_mass"] ?? 0;
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


export interface Triglyceride_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
