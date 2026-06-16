// Auto-generated from reduced-pressure-calculator-schema.json
import * as z from 'zod';

export interface Reduced_pressure_calculatorInput {
  upstreamPressure: number;
  flowRate: number;
  specificGravity: number;
  kvCoefficient: number;
  safetyFactor: number;
}

export const Reduced_pressure_calculatorInputSchema = z.object({
  upstreamPressure: z.number().default(10),
  flowRate: z.number().default(100),
  specificGravity: z.number().default(1),
  kvCoefficient: z.number().default(10),
  safetyFactor: z.number().default(1.2),
});

function evaluateAllFormulas(input: Reduced_pressure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.specificGravity * Math.pow((input.flowRate * 0.06) / input.kvCoefficient, 2); results["pressureDrop"] = Number.isFinite(v) ? v : 0; } catch { results["pressureDrop"] = 0; }
  try { const v = input.safetyFactor * input.specificGravity * Math.pow((input.flowRate * 0.06) / input.kvCoefficient, 2); results["adjustedPressureDrop"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedPressureDrop"] = 0; }
  try { const v = input.upstreamPressure - input.safetyFactor * input.specificGravity * Math.pow((input.flowRate * 0.06) / input.kvCoefficient, 2); results["reducedPressure"] = Number.isFinite(v) ? v : 0; } catch { results["reducedPressure"] = 0; }
  return results;
}


export function calculateReduced_pressure_calculator(input: Reduced_pressure_calculatorInput): Reduced_pressure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["reducedPressure"] ?? 0;
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


export interface Reduced_pressure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
