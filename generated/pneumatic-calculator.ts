// Auto-generated from pneumatic-calculator-schema.json
import * as z from 'zod';

export interface Pneumatic_calculatorInput {
  boreDiameter: number;
  rodDiameter: number;
  pressure: number;
  stroke: number;
  cyclesPerMinute: number;
  safetyFactor: number;
}

export const Pneumatic_calculatorInputSchema = z.object({
  boreDiameter: z.number().default(50),
  rodDiameter: z.number().default(20),
  pressure: z.number().default(6),
  stroke: z.number().default(100),
  cyclesPerMinute: z.number().default(30),
  safetyFactor: z.number().default(10),
});

function evaluateAllFormulas(input: Pneumatic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressure * Math.PI * Math.pow(input.boreDiameter / 2, 2) * 0.1; results["forceExtend"] = Number.isFinite(v) ? v : 0; } catch { results["forceExtend"] = 0; }
  try { const v = input.pressure * (Math.PI * Math.pow(input.boreDiameter / 2, 2) - Math.PI * Math.pow(input.rodDiameter / 2, 2)) * 0.1; results["forceRetract"] = Number.isFinite(v) ? v : 0; } catch { results["forceRetract"] = 0; }
  try { const v = ((Math.PI * Math.pow(input.boreDiameter / 2, 2) * input.stroke + (Math.PI * Math.pow(input.boreDiameter / 2, 2) - Math.PI * Math.pow(input.rodDiameter / 2, 2)) * input.stroke) / 1000000) * (input.pressure + 1) * input.cyclesPerMinute; results["freeAirPerMinute"] = Number.isFinite(v) ? v : 0; } catch { results["freeAirPerMinute"] = 0; }
  try { const v = input.pressure * Math.PI * Math.pow(input.boreDiameter / 2, 2) * 0.1 * (1 + input.safetyFactor / 100); results["recommendedForce"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedForce"] = 0; }
  return results;
}


export function calculatePneumatic_calculator(input: Pneumatic_calculatorInput): Pneumatic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["forceExtend"] ?? 0;
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


export interface Pneumatic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
