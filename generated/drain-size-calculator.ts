// Auto-generated from drain-size-calculator-schema.json
import * as z from 'zod';

export interface Drain_size_calculatorInput {
  flowRate: number;
  slope: number;
  manningN: number;
  safetyFactor: number;
}

export const Drain_size_calculatorInputSchema = z.object({
  flowRate: z.number().default(10),
  slope: z.number().default(0.01),
  manningN: z.number().default(0.013),
  safetyFactor: z.number().default(1.2),
});

function evaluateAllFormulas(input: Drain_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((4**(5/3) * input.manningN * (input.flowRate / 1000) * input.safetyFactor) / (Math.PI * Math.sqrt(input.slope))) ** (3/8); results["diameter_m"] = Number.isFinite(v) ? v : 0; } catch { results["diameter_m"] = 0; }
  try { const v = (results["diameter_m"] ?? 0) * 1000; results["diameter_mm"] = Number.isFinite(v) ? v : 0; } catch { results["diameter_mm"] = 0; }
  try { const v = (input.flowRate / 1000) / (Math.PI * ((results["diameter_m"] ?? 0) ** 2) / 4); results["velocity"] = Number.isFinite(v) ? v : 0; } catch { results["velocity"] = 0; }
  try { const v = Math.PI * ((results["diameter_m"] ?? 0) ** 2) / 4; results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  return results;
}


export function calculateDrain_size_calculator(input: Drain_size_calculatorInput): Drain_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["diameter_mm"] ?? 0;
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


export interface Drain_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
