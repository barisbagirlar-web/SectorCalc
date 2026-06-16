// Auto-generated from boiler-calculator-schema.json
import * as z from 'zod';

export interface Boiler_calculatorInput {
  steamFlow: number;
  steamEnthalpy: number;
  feedWaterTemperature: number;
  fuelFlow: number;
  fuelGCV: number;
}

export const Boiler_calculatorInputSchema = z.object({
  steamFlow: z.number().default(10000),
  steamEnthalpy: z.number().default(2776),
  feedWaterTemperature: z.number().default(105),
  fuelFlow: z.number().default(1500),
  fuelGCV: z.number().default(25000),
});

function evaluateAllFormulas(input: Boiler_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.steamFlow * (input.steamEnthalpy - 4.186 * input.feedWaterTemperature)) / 3600; results["steamEnergyOutput_kW"] = Number.isFinite(v) ? v : 0; } catch { results["steamEnergyOutput_kW"] = 0; }
  try { const v = (input.fuelFlow * input.fuelGCV) / 3600; results["fuelEnergyInput_kW"] = Number.isFinite(v) ? v : 0; } catch { results["fuelEnergyInput_kW"] = 0; }
  try { const v = ((input.steamFlow * (input.steamEnthalpy - 4.186 * input.feedWaterTemperature)) / (input.fuelFlow * input.fuelGCV)) * 100; results["efficiency"] = Number.isFinite(v) ? v : 0; } catch { results["efficiency"] = 0; }
  return results;
}


export function calculateBoiler_calculator(input: Boiler_calculatorInput): Boiler_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["efficiency"] ?? 0;
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


export interface Boiler_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
