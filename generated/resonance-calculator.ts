// Auto-generated from resonance-calculator-schema.json
import * as z from 'zod';

export interface Resonance_calculatorInput {
  mass: number;
  stiffness: number;
  dampingRatio: number;
  excitationFrequency: number;
}

export const Resonance_calculatorInputSchema = z.object({
  mass: z.number().default(1),
  stiffness: z.number().default(100),
  dampingRatio: z.number().default(0.05),
  excitationFrequency: z.number().default(1),
});

function evaluateAllFormulas(input: Resonance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(input.stiffness/input.mass); results["omega_n"] = Number.isFinite(v) ? v : 0; } catch { results["omega_n"] = 0; }
  try { const v = (results["omega_n"] ?? 0)/(2*Math.PI); results["f_n"] = Number.isFinite(v) ? v : 0; } catch { results["f_n"] = 0; }
  try { const v = input.excitationFrequency/(results["f_n"] ?? 0); results["r"] = Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = 1 / Math.sqrt((1 - (results["r"] ?? 0)*(results["r"] ?? 0))*(1 - (results["r"] ?? 0)*(results["r"] ?? 0)) + 4*input.dampingRatio*input.dampingRatio*(results["r"] ?? 0)*(results["r"] ?? 0)); results["M"] = Number.isFinite(v) ? v : 0; } catch { results["M"] = 0; }
  try { const v = (input.dampingRatio < 1) ? (results["f_n"] ?? 0) * Math.sqrt(1 - input.dampingRatio*input.dampingRatio) : 0; results["f_d"] = Number.isFinite(v) ? v : 0; } catch { results["f_d"] = 0; }
  try { const v = 1/(2*input.dampingRatio); results["q"] = Number.isFinite(v) ? v : 0; } catch { results["q"] = 0; }
  return results;
}


export function calculateResonance_calculator(input: Resonance_calculatorInput): Resonance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["M"] ?? 0;
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


export interface Resonance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
