// Auto-generated from mass-flow-rate-orifice-calculator-schema.json
import * as z from 'zod';

export interface Mass_flow_rate_orifice_calculatorInput {
  dischargeCoefficient: number;
  orificeArea: number;
  fluidDensity: number;
  pressureDifference: number;
}

export const Mass_flow_rate_orifice_calculatorInputSchema = z.object({
  dischargeCoefficient: z.number().default(0.62),
  orificeArea: z.number().default(0.01),
  fluidDensity: z.number().default(1000),
  pressureDifference: z.number().default(10000),
});

function evaluateAllFormulas(input: Mass_flow_rate_orifice_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dischargeCoefficient * input.orificeArea * Math.sqrt(2 * input.fluidDensity * input.pressureDifference); results["massFlowRate"] = Number.isFinite(v) ? v : 0; } catch { results["massFlowRate"] = 0; }
  try { const v = input.dischargeCoefficient * input.orificeArea * Math.sqrt(2 * input.fluidDensity * input.pressureDifference); results["massFlowRate_copy"] = Number.isFinite(v) ? v : 0; } catch { results["massFlowRate_copy"] = 0; }
  return results;
}


export function calculateMass_flow_rate_orifice_calculator(input: Mass_flow_rate_orifice_calculatorInput): Mass_flow_rate_orifice_calculatorOutput {
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


export interface Mass_flow_rate_orifice_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
