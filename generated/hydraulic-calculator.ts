// Auto-generated from hydraulic-calculator-schema.json
import * as z from 'zod';

export interface Hydraulic_calculatorInput {
  pressure: number;
  flowRate: number;
  efficiency: number;
  boreDia: number;
  rodDia: number;
}

export const Hydraulic_calculatorInputSchema = z.object({
  pressure: z.number().default(100),
  flowRate: z.number().default(50),
  efficiency: z.number().default(85),
  boreDia: z.number().default(80),
  rodDia: z.number().default(40),
});

function evaluateAllFormulas(input: Hydraulic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.pressure * input.flowRate) / (600 * (input.efficiency / 100)); results["power"] = Number.isFinite(v) ? v : 0; } catch { results["power"] = 0; }
  try { const v = (input.pressure * Math.PI * input.boreDia**2) / 40000; results["pushForce"] = Number.isFinite(v) ? v : 0; } catch { results["pushForce"] = 0; }
  try { const v = (input.pressure * Math.PI * (input.boreDia**2 - input.rodDia**2)) / 40000; results["pullForce"] = Number.isFinite(v) ? v : 0; } catch { results["pullForce"] = 0; }
  return results;
}


export function calculateHydraulic_calculator(input: Hydraulic_calculatorInput): Hydraulic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["power"] ?? 0;
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


export interface Hydraulic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
