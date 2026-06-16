// Auto-generated from geothermal-net-power-calculator-schema.json
import * as z from 'zod';

export interface Geothermal_net_power_calculatorInput {
  massFlowRate: number;
  specificHeat: number;
  inletTemp: number;
  outletTemp: number;
  conversionEfficiency: number;
  parasiticLoad: number;
}

export const Geothermal_net_power_calculatorInputSchema = z.object({
  massFlowRate: z.number().default(50),
  specificHeat: z.number().default(4200),
  inletTemp: z.number().default(150),
  outletTemp: z.number().default(80),
  conversionEfficiency: z.number().default(12),
  parasiticLoad: z.number().default(100),
});

function evaluateAllFormulas(input: Geothermal_net_power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massFlowRate * input.specificHeat * (input.inletTemp - input.outletTemp) * (input.conversionEfficiency / 100) / 1000; results["grossPower"] = Number.isFinite(v) ? v : 0; } catch { results["grossPower"] = 0; }
  try { const v = (results["grossPower"] ?? 0) - input.parasiticLoad; results["netPower"] = Number.isFinite(v) ? v : 0; } catch { results["netPower"] = 0; }
  return results;
}


export function calculateGeothermal_net_power_calculator(input: Geothermal_net_power_calculatorInput): Geothermal_net_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netPower"] ?? 0;
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


export interface Geothermal_net_power_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
