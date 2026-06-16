// Auto-generated from compressible-flow-calculator-schema.json
import * as z from 'zod';

export interface Compressible_flow_calculatorInput {
  upstreamPressure: number;
  downstreamPressure: number;
  temperature: number;
  gasConstant: number;
  specificHeatRatio: number;
  orificeDiameter: number;
  dischargeCoefficient: number;
}

export const Compressible_flow_calculatorInputSchema = z.object({
  upstreamPressure: z.number().default(5),
  downstreamPressure: z.number().default(1),
  temperature: z.number().default(293.15),
  gasConstant: z.number().default(287),
  specificHeatRatio: z.number().default(1.4),
  orificeDiameter: z.number().default(10),
  dischargeCoefficient: z.number().default(0.85),
});

function evaluateAllFormulas(input: Compressible_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.downstreamPressure / input.upstreamPressure; results["pressureRatio"] = Number.isFinite(v) ? v : 0; } catch { results["pressureRatio"] = 0; }
  try { const v = (2 / (input.specificHeatRatio + 1)) ** (input.specificHeatRatio / (input.specificHeatRatio - 1)); results["criticalPressureRatio"] = Number.isFinite(v) ? v : 0; } catch { results["criticalPressureRatio"] = 0; }
  try { const v = (results["pressureRatio"] ?? 0) <= (results["criticalPressureRatio"] ?? 0) ? 'choked' : 'subsonic'; results["flowType"] = Number.isFinite(v) ? v : 0; } catch { results["flowType"] = 0; }
  try { const v = input.dischargeCoefficient * (Math.PI / 4) * (input.orificeDiameter / 1000) ** 2 * input.upstreamPressure * 1e5 * Math.sqrt(input.specificHeatRatio / (input.gasConstant * input.temperature)) * ((results["pressureRatio"] ?? 0) <= (results["criticalPressureRatio"] ?? 0) ? Math.sqrt((2 / (input.specificHeatRatio + 1)) ** ((input.specificHeatRatio + 1) / (input.specificHeatRatio - 1))) : Math.sqrt((2 * input.specificHeatRatio / (input.specificHeatRatio - 1)) * ((results["pressureRatio"] ?? 0) ** (2 / input.specificHeatRatio) - (results["pressureRatio"] ?? 0) ** ((input.specificHeatRatio + 1) / input.specificHeatRatio)))); results["massFlowRate"] = Number.isFinite(v) ? v : 0; } catch { results["massFlowRate"] = 0; }
  try { const v = (results["massFlowRate"] ?? 0) / ( (Math.PI / 4) * (input.orificeDiameter / 1000) ** 2 * (input.downstreamPressure * 1e5) / (input.gasConstant * input.temperature) ); results["velocity"] = Number.isFinite(v) ? v : 0; } catch { results["velocity"] = 0; }
  return results;
}


export function calculateCompressible_flow_calculator(input: Compressible_flow_calculatorInput): Compressible_flow_calculatorOutput {
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


export interface Compressible_flow_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
