// Auto-generated from stair-rise-run-calculator-schema.json
import * as z from 'zod';

export interface Stair_rise_run_calculatorInput {
  totalRise: number;
  totalRun: number;
  maxRiserHeight: number;
  minTreadDepth: number;
  desiredRise: number;
  nosing: number;
}

export const Stair_rise_run_calculatorInputSchema = z.object({
  totalRise: z.number().default(2800),
  totalRun: z.number().default(3500),
  maxRiserHeight: z.number().default(190),
  minTreadDepth: z.number().default(250),
  desiredRise: z.number().default(175),
  nosing: z.number().default(25),
});

function evaluateAllFormulas(input: Stair_rise_run_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(input.totalRise / input.desiredRise); results["numSteps"] = Number.isFinite(v) ? v : 0; } catch { results["numSteps"] = 0; }
  try { const v = input.totalRise / (results["numSteps"] ?? 0); results["actualRiser"] = Number.isFinite(v) ? v : 0; } catch { results["actualRiser"] = 0; }
  try { const v = input.totalRun / ((results["numSteps"] ?? 0) - 1); results["treadDepth"] = Number.isFinite(v) ? v : 0; } catch { results["treadDepth"] = 0; }
  try { const v = 'Rise: ' + (results["actualRiser"] ?? 0).toFixed(1) + ' mm, Tread: ' + (results["treadDepth"] ?? 0).toFixed(1) + ' mm, Steps: ' + (results["numSteps"] ?? 0); results["primaryOutput"] = Number.isFinite(v) ? v : 0; } catch { results["primaryOutput"] = 0; }
  try { const v = 'Rise per step: ' + (results["actualRiser"] ?? 0).toFixed(1) + ' mm'; results["breakdown_0"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_0"] = 0; }
  try { const v = 'Tread depth: ' + (results["treadDepth"] ?? 0).toFixed(1) + ' mm'; results["breakdown_1"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_1"] = 0; }
  try { const v = 'Number of risers: ' + (results["numSteps"] ?? 0); results["breakdown_2"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_2"] = 0; }
  try { const v = 'Number of treads: ' + ((results["numSteps"] ?? 0) - 1); results["breakdown_3"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_3"] = 0; }
  try { const v = 'Stair angle: ' + (Math.atan(input.totalRise / input.totalRun) * 180 / Math.PI).toFixed(2) + '°'; results["breakdown_4"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_4"] = 0; }
  return results;
}


export function calculateStair_rise_run_calculator(input: Stair_rise_run_calculatorInput): Stair_rise_run_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryOutput"] ?? 0;
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


export interface Stair_rise_run_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
