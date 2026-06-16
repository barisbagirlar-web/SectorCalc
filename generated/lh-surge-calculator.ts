// Auto-generated from lh-surge-calculator-schema.json
import * as z from 'zod';

export interface Lh_surge_calculatorInput {
  flowVelocity: number;
  pipeDiameter: number;
  pipeLength: number;
  valveCloseTime: number;
  waveSpeed: number;
  fluidDensity: number;
  wallThickness: number;
}

export const Lh_surge_calculatorInputSchema = z.object({
  flowVelocity: z.number().default(2),
  pipeDiameter: z.number().default(0.3),
  pipeLength: z.number().default(100),
  valveCloseTime: z.number().default(1),
  waveSpeed: z.number().default(1200),
  fluidDensity: z.number().default(1000),
  wallThickness: z.number().default(0.01),
});

function evaluateAllFormulas(input: Lh_surge_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fluidDensity * input.waveSpeed * input.flowVelocity * Math.min(1, (2 * input.pipeLength) / (input.waveSpeed * input.valveCloseTime)); results["surgePressurePa"] = Number.isFinite(v) ? v : 0; } catch { results["surgePressurePa"] = 0; }
  try { const v = ((results["surgePressurePa"] ?? 0) * input.pipeDiameter) / (2 * input.wallThickness); results["hoopStressPa"] = Number.isFinite(v) ? v : 0; } catch { results["hoopStressPa"] = 0; }
  try { const v = (results["surgePressurePa"] ?? 0) / 100000; results["surgePressureBar"] = Number.isFinite(v) ? v : 0; } catch { results["surgePressureBar"] = 0; }
  return results;
}


export function calculateLh_surge_calculator(input: Lh_surge_calculatorInput): Lh_surge_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["surgePressureBar"] ?? 0;
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


export interface Lh_surge_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
