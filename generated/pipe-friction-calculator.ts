// Auto-generated from pipe-friction-calculator-schema.json
import * as z from 'zod';

export interface Pipe_friction_calculatorInput {
  pipeLength: number;
  innerDiameter: number;
  flowRate: number;
  roughness: number;
  fluidDensity: number;
  dynamicViscosity: number;
}

export const Pipe_friction_calculatorInputSchema = z.object({
  pipeLength: z.number().default(100),
  innerDiameter: z.number().default(50),
  flowRate: z.number().default(10),
  roughness: z.number().default(0.045),
  fluidDensity: z.number().default(1000),
  dynamicViscosity: z.number().default(0.001),
});

function evaluateAllFormulas(input: Pipe_friction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.innerDiameter / 1000; results["diameterM"] = Number.isFinite(v) ? v : 0; } catch { results["diameterM"] = 0; }
  try { const v = input.flowRate / 1000; results["flowRateM3ps"] = Number.isFinite(v) ? v : 0; } catch { results["flowRateM3ps"] = 0; }
  try { const v = Math.PI * ((results["diameterM"] ?? 0) / 2) ** 2; results["crossArea"] = Number.isFinite(v) ? v : 0; } catch { results["crossArea"] = 0; }
  try { const v = (results["flowRateM3ps"] ?? 0) / (results["crossArea"] ?? 0); results["velocity"] = Number.isFinite(v) ? v : 0; } catch { results["velocity"] = 0; }
  try { const v = input.fluidDensity * (results["velocity"] ?? 0) * (results["diameterM"] ?? 0) / input.dynamicViscosity; results["reynoldsNumber"] = Number.isFinite(v) ? v : 0; } catch { results["reynoldsNumber"] = 0; }
  try { const v = 0.25 / Math.pow(Math.log10(input.roughness / (1000 * 3.7 * (results["diameterM"] ?? 0)) + 5.74 / Math.pow((results["reynoldsNumber"] ?? 0), 0.9)), 2); results["frictionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["frictionFactor"] = 0; }
  try { const v = (results["frictionFactor"] ?? 0) * (input.pipeLength / (results["diameterM"] ?? 0)) * ((results["velocity"] ?? 0) ** 2 / (2 * 9.81)); results["headLoss"] = Number.isFinite(v) ? v : 0; } catch { results["headLoss"] = 0; }
  try { const v = (results["frictionFactor"] ?? 0) * (input.pipeLength / (results["diameterM"] ?? 0)) * (input.fluidDensity * (results["velocity"] ?? 0) ** 2 / 2); results["pressureDrop"] = Number.isFinite(v) ? v : 0; } catch { results["pressureDrop"] = 0; }
  return results;
}


export function calculatePipe_friction_calculator(input: Pipe_friction_calculatorInput): Pipe_friction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["headLoss"] ?? 0;
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


export interface Pipe_friction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
