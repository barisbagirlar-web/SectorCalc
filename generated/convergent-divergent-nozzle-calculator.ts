// Auto-generated from convergent-divergent-nozzle-calculator-schema.json
import * as z from 'zod';

export interface Convergent_divergent_nozzle_calculatorInput {
  totalPressure: number;
  totalTemperature: number;
  throatArea: number;
  exitArea: number;
  gasConstant: number;
  specificHeatRatio: number;
  ambientPressure: number;
}

export const Convergent_divergent_nozzle_calculatorInputSchema = z.object({
  totalPressure: z.number().default(500000),
  totalTemperature: z.number().default(300),
  throatArea: z.number().default(0.001),
  exitArea: z.number().default(0.005),
  gasConstant: z.number().default(287),
  specificHeatRatio: z.number().default(1.4),
  ambientPressure: z.number().default(101325),
});

function evaluateAllFormulas(input: Convergent_divergent_nozzle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.throatArea * input.totalPressure / Math.sqrt(input.totalTemperature)) * Math.sqrt( (input.specificHeatRatio / input.gasConstant) * Math.pow(2/(input.specificHeatRatio+1), (input.specificHeatRatio+1)/(input.specificHeatRatio-1)) ); results["massFlowRate"] = Number.isFinite(v) ? v : 0; } catch { results["massFlowRate"] = 0; }
  try { const v = Math.sqrt( (2*input.specificHeatRatio*input.gasConstant*input.totalTemperature)/(input.specificHeatRatio-1) * (1 - Math.pow(input.ambientPressure/input.totalPressure, (input.specificHeatRatio-1)/input.specificHeatRatio)) ); results["exitVelocity"] = Number.isFinite(v) ? v : 0; } catch { results["exitVelocity"] = 0; }
  try { const v = (results["massFlowRate"] ?? 0) * (results["exitVelocity"] ?? 0); results["thrust"] = Number.isFinite(v) ? v : 0; } catch { results["thrust"] = 0; }
  return results;
}


export function calculateConvergent_divergent_nozzle_calculator(input: Convergent_divergent_nozzle_calculatorInput): Convergent_divergent_nozzle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["massFlowRate"] ?? 0;
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


export interface Convergent_divergent_nozzle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
