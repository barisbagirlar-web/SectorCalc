// Auto-generated from monte-carlo-simulation-schema.json
import * as z from 'zod';

export interface Monte_carlo_simulationInput {
  mean: number;
  stdDev: number;
  lowerSpec: number;
  upperSpec: number;
  numSamples: number;
  seed: number;
  dataConfidence?: number;
}

export const Monte_carlo_simulationInputSchema = z.object({
  mean: z.number().default(100),
  stdDev: z.number().default(10),
  lowerSpec: z.number().default(80),
  upperSpec: z.number().default(120),
  numSamples: z.number().default(10000),
  seed: z.number().default(42),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Monte_carlo_simulationInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.upperSpec - input.lowerSpec) / (6 * input.stdDev); results["cp"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cp"] = 0; }
  try { const v = (input.upperSpec - input.lowerSpec) / (6 * input.stdDev); results["cp_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cp_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMonte_carlo_simulation(input: Monte_carlo_simulationInput): Monte_carlo_simulationOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["cp_aux"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
