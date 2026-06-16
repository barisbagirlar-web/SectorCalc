// Auto-generated from grill-temperature-calculator-schema.json
import * as z from 'zod';

export interface Grill_temperature_calculatorInput {
  ambientTemp: number;
  grillArea: number;
  heatInput: number;
  efficiency: number;
  heatTransferCoeff: number;
}

export const Grill_temperature_calculatorInputSchema = z.object({
  ambientTemp: z.number().default(25),
  grillArea: z.number().default(0.5),
  heatInput: z.number().default(2000),
  efficiency: z.number().default(80),
  heatTransferCoeff: z.number().default(10),
});

function evaluateAllFormulas(input: Grill_temperature_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.heatInput * (input.efficiency / 100); results["effectiveHeat"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveHeat"] = 0; }
  try { const v = (results["effectiveHeat"] ?? 0) / (input.grillArea * input.heatTransferCoeff); results["temperatureRise"] = Number.isFinite(v) ? v : 0; } catch { results["temperatureRise"] = 0; }
  try { const v = input.ambientTemp + (results["temperatureRise"] ?? 0); results["grillTemperature"] = Number.isFinite(v) ? v : 0; } catch { results["grillTemperature"] = 0; }
  return results;
}


export function calculateGrill_temperature_calculator(input: Grill_temperature_calculatorInput): Grill_temperature_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["grillTemperature"] ?? 0;
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


export interface Grill_temperature_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
