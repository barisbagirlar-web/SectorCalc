// Auto-generated from psi-to-atm-calculator-schema.json
import * as z from 'zod';

export interface Psi_to_atm_calculatorInput {
  pressurePsi: number;
  factor: number;
  offset: number;
  precision: number;
}

export const Psi_to_atm_calculatorInputSchema = z.object({
  pressurePsi: z.number().default(0),
  factor: z.number().default(0.0680459639),
  offset: z.number().default(0),
  precision: z.number().default(4),
});

function evaluateAllFormulas(input: Psi_to_atm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressurePsi + input.offset; results["adjustedPsi"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedPsi"] = 0; }
  try { const v = (results["adjustedPsi"] ?? 0) * input.factor; results["atm"] = Number.isFinite(v) ? v : 0; } catch { results["atm"] = 0; }
  try { const v = Math.round((results["atm"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["roundedAtm"] = Number.isFinite(v) ? v : 0; } catch { results["roundedAtm"] = 0; }
  return results;
}


export function calculatePsi_to_atm_calculator(input: Psi_to_atm_calculatorInput): Psi_to_atm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedAtm"] ?? 0;
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


export interface Psi_to_atm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
