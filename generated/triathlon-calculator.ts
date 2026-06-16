// Auto-generated from triathlon-calculator-schema.json
import * as z from 'zod';

export interface Triathlon_calculatorInput {
  swimDistance: number;
  bikeDistance: number;
  runDistance: number;
  swimPace: number;
  bikeSpeed: number;
  runPace: number;
}

export const Triathlon_calculatorInputSchema = z.object({
  swimDistance: z.number().default(1500),
  bikeDistance: z.number().default(40),
  runDistance: z.number().default(10),
  swimPace: z.number().default(2),
  bikeSpeed: z.number().default(30),
  runPace: z.number().default(5),
});

function evaluateAllFormulas(input: Triathlon_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { return (input.swimDistance / 100) * input.swimPace; })(); results["swimTime"] = Number.isFinite(v) ? v : 0; } catch { results["swimTime"] = 0; }
  try { const v = (() => { return (input.bikeDistance / input.bikeSpeed) * 60; })(); results["bikeTime"] = Number.isFinite(v) ? v : 0; } catch { results["bikeTime"] = 0; }
  try { const v = (() => { return input.runDistance * input.runPace; })(); results["runTime"] = Number.isFinite(v) ? v : 0; } catch { results["runTime"] = 0; }
  try { const v = (() => { var swim = (input.swimDistance / 100) * input.swimPace; var bike = (input.bikeDistance / input.bikeSpeed) * 60; var run = input.runDistance * input.runPace; var totalMin = swim + bike + run; var h = Math.floor(totalMin / 60); var m = Math.floor(totalMin % 60); var s = Math.round(totalMin % 1 * 60); if (s === 60) { m++; s = 0; } if (m === 60) { h++; m = 0; } return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0'); })(); results["totalTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalTime"] = 0; }
  return results;
}


export function calculateTriathlon_calculator(input: Triathlon_calculatorInput): Triathlon_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalTime"] ?? 0;
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


export interface Triathlon_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
