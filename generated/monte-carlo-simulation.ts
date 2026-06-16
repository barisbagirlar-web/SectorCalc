// Auto-generated from monte-carlo-simulation-schema.json
import * as z from 'zod';

export interface Monte_carlo_simulationInput {
  mean: number;
  stdDev: number;
  lowerSpec: number;
  upperSpec: number;
  numSamples: number;
  seed: number;
}

export const Monte_carlo_simulationInputSchema = z.object({
  mean: z.number().default(100),
  stdDev: z.number().default(10),
  lowerSpec: z.number().default(80),
  upperSpec: z.number().default(120),
  numSamples: z.number().default(10000),
  seed: z.number().default(42),
});

function evaluateAllFormulas(input: Monte_carlo_simulationInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { let samples = []; for(let i=0; i<input.numSamples; i++){ let u1 = Math.random(); let u2 = Math.random(); let z = Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2); samples.push(input.mean + input.stdDev*z); return } samples; })(); results["generateSamples"] = Number.isFinite(v) ? v : 0; } catch { results["generateSamples"] = 0; }
  try { const v = (() => { let samples = (results["generateSamples"]); let count = 0; for(let s of samples){ if(s < input.lowerSpec || s > input.upperSpec) count++; return } count; })(); results["defects"] = Number.isFinite(v) ? v : 0; } catch { results["defects"] = 0; }
  try { const v = (results["defects"] ?? 0) / input.numSamples; results["defectRate"] = Number.isFinite(v) ? v : 0; } catch { results["defectRate"] = 0; }
  try { const v = 1 - (results["defectRate"] ?? 0); results["yield"] = Number.isFinite(v) ? v : 0; } catch { results["yield"] = 0; }
  try { const v = (input.upperSpec - input.lowerSpec) / (6 * input.stdDev); results["cp"] = Number.isFinite(v) ? v : 0; } catch { results["cp"] = 0; }
  try { const v = Math.min((input.mean - input.lowerSpec)/(3*input.stdDev), (input.upperSpec - input.mean)/(3*input.stdDev)); results["cpk"] = Number.isFinite(v) ? v : 0; } catch { results["cpk"] = 0; }
  return results;
}


export function calculateMonte_carlo_simulation(input: Monte_carlo_simulationInput): Monte_carlo_simulationOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["defectRate"] ?? 0;
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


export interface Monte_carlo_simulationOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
