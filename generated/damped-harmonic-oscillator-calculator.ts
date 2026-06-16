// Auto-generated from damped-harmonic-oscillator-calculator-schema.json
import * as z from 'zod';

export interface Damped_harmonic_oscillator_calculatorInput {
  mass: number;
  dampingCoeff: number;
  springConst: number;
  initDisp: number;
  initVeloc: number;
  time: number;
}

export const Damped_harmonic_oscillator_calculatorInputSchema = z.object({
  mass: z.number().default(1),
  dampingCoeff: z.number().default(0.5),
  springConst: z.number().default(10),
  initDisp: z.number().default(0.1),
  initVeloc: z.number().default(0),
  time: z.number().default(1),
});

function evaluateAllFormulas(input: Damped_harmonic_oscillator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (m = input.mass, c = input.dampingCoeff, k = input.springConst, x0 = input.initDisp, v0 = input.initVeloc, t = input.time, z = c / (2 * Math.sqrt(m * k)), wn = Math.sqrt(k / m), wd = wn * Math.sqrt(1 - z * z), Math.exp(-z * wn * t) * (x0 * Math.cos(wd * t) + (v0 + z * wn * x0) / wd * Math.sin(wd * t))); results["displacementAtTime"] = Number.isFinite(v) ? v : 0; } catch { results["displacementAtTime"] = 0; }
  try { const v = (m = input.mass, c = input.dampingCoeff, k = input.springConst, c / (2 * Math.sqrt(m * k))); results["dampingRatio"] = Number.isFinite(v) ? v : 0; } catch { results["dampingRatio"] = 0; }
  try { const v = (m = input.mass, k = input.springConst, Math.sqrt(k / m)); results["naturalFrequency"] = Number.isFinite(v) ? v : 0; } catch { results["naturalFrequency"] = 0; }
  try { const v = (m = input.mass, c = input.dampingCoeff, k = input.springConst, z = c / (2 * Math.sqrt(m * k)), wn = Math.sqrt(k / m), wn * Math.sqrt(1 - z * z)); results["dampedFrequency"] = Number.isFinite(v) ? v : 0; } catch { results["dampedFrequency"] = 0; }
  return results;
}


export function calculateDamped_harmonic_oscillator_calculator(input: Damped_harmonic_oscillator_calculatorInput): Damped_harmonic_oscillator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["displacementAtTime"] ?? 0;
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


export interface Damped_harmonic_oscillator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
