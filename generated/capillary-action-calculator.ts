// Auto-generated from capillary-action-calculator-schema.json
import * as z from 'zod';

export interface Capillary_action_calculatorInput {
  surfaceTension: number;
  contactAngle: number;
  density: number;
  radius: number;
  gravity: number;
}

export const Capillary_action_calculatorInputSchema = z.object({
  surfaceTension: z.number().default(0.0728),
  contactAngle: z.number().default(20),
  density: z.number().default(1000),
  radius: z.number().default(0.0005),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Capillary_action_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * input.surfaceTension * Math.cos(input.contactAngle * Math.PI / 180) / (input.density * input.gravity * input.radius); results["heightM"] = Number.isFinite(v) ? v : 0; } catch { results["heightM"] = 0; }
  try { const v = (results["heightM"] ?? 0) * 100; results["heightCm"] = Number.isFinite(v) ? v : 0; } catch { results["heightCm"] = 0; }
  return results;
}


export function calculateCapillary_action_calculator(input: Capillary_action_calculatorInput): Capillary_action_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["heightM"] ?? 0;
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


export interface Capillary_action_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
