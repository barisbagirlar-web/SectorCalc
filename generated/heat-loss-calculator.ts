// Auto-generated from heat-loss-calculator-schema.json
import * as z from 'zod';

export interface Heat_loss_calculatorInput {
  wallArea: number;
  windowArea: number;
  roofArea: number;
  uWall: number;
  uWindow: number;
  uRoof: number;
  indoorTemp: number;
  outdoorTemp: number;
}

export const Heat_loss_calculatorInputSchema = z.object({
  wallArea: z.number().default(100),
  windowArea: z.number().default(20),
  roofArea: z.number().default(60),
  uWall: z.number().default(0.25),
  uWindow: z.number().default(1.8),
  uRoof: z.number().default(0.2),
  indoorTemp: z.number().default(20),
  outdoorTemp: z.number().default(-5),
});

function evaluateAllFormulas(input: Heat_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.indoorTemp - input.outdoorTemp; results["deltaT"] = Number.isFinite(v) ? v : 0; } catch { results["deltaT"] = 0; }
  try { const v = input.uWall * input.wallArea * (results["deltaT"] ?? 0); results["wallLoss"] = Number.isFinite(v) ? v : 0; } catch { results["wallLoss"] = 0; }
  try { const v = input.uWindow * input.windowArea * (results["deltaT"] ?? 0); results["windowLoss"] = Number.isFinite(v) ? v : 0; } catch { results["windowLoss"] = 0; }
  try { const v = input.uRoof * input.roofArea * (results["deltaT"] ?? 0); results["roofLoss"] = Number.isFinite(v) ? v : 0; } catch { results["roofLoss"] = 0; }
  try { const v = (results["wallLoss"] ?? 0) + (results["windowLoss"] ?? 0) + (results["roofLoss"] ?? 0); results["totalHeatLoss"] = Number.isFinite(v) ? v : 0; } catch { results["totalHeatLoss"] = 0; }
  return results;
}


export function calculateHeat_loss_calculator(input: Heat_loss_calculatorInput): Heat_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalHeatLoss"] ?? 0;
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


export interface Heat_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
