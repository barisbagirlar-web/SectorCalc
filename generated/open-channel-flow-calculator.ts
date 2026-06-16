// Auto-generated from open-channel-flow-calculator-schema.json
import * as z from 'zod';

export interface Open_channel_flow_calculatorInput {
  bottomWidth: number;
  depth: number;
  sideSlope: number;
  manningN: number;
  slope: number;
  gravity: number;
}

export const Open_channel_flow_calculatorInputSchema = z.object({
  bottomWidth: z.number().default(2),
  depth: z.number().default(1),
  sideSlope: z.number().default(1.5),
  manningN: z.number().default(0.013),
  slope: z.number().default(0.001),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Open_channel_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bottomWidth + input.sideSlope * input.depth) * input.depth; results["A"] = Number.isFinite(v) ? v : 0; } catch { results["A"] = 0; }
  try { const v = input.bottomWidth + 2 * input.depth * Math.sqrt(1 + input.sideSlope * input.sideSlope); results["P"] = Number.isFinite(v) ? v : 0; } catch { results["P"] = 0; }
  try { const v = (results["A"] ?? 0) / (results["P"] ?? 0); results["R"] = Number.isFinite(v) ? v : 0; } catch { results["R"] = 0; }
  try { const v = (1 / input.manningN) * (results["A"] ?? 0) * Math.pow((results["R"] ?? 0), 2 / 3) * Math.sqrt(input.slope); results["Discharge"] = Number.isFinite(v) ? v : 0; } catch { results["Discharge"] = 0; }
  try { const v = (results["Discharge"] ?? 0) / (results["A"] ?? 0); results["Velocity"] = Number.isFinite(v) ? v : 0; } catch { results["Velocity"] = 0; }
  try { const v = input.bottomWidth + 2 * input.sideSlope * input.depth; results["TopWidth"] = Number.isFinite(v) ? v : 0; } catch { results["TopWidth"] = 0; }
  try { const v = (results["A"] ?? 0) / (results["TopWidth"] ?? 0); results["HydraulicDepth"] = Number.isFinite(v) ? v : 0; } catch { results["HydraulicDepth"] = 0; }
  try { const v = (results["Velocity"] ?? 0) / Math.sqrt(input.gravity * (results["HydraulicDepth"] ?? 0)); results["FroudeNumber"] = Number.isFinite(v) ? v : 0; } catch { results["FroudeNumber"] = 0; }
  try { const v = input.depth + ((results["Velocity"] ?? 0) * (results["Velocity"] ?? 0)) / (2 * input.gravity); results["SpecificEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["SpecificEnergy"] = 0; }
  return results;
}


export function calculateOpen_channel_flow_calculator(input: Open_channel_flow_calculatorInput): Open_channel_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Discharge"] ?? 0;
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


export interface Open_channel_flow_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
