// Auto-generated from water-heater-calculator-schema.json
import * as z from 'zod';

export interface Water_heater_calculatorInput {
  volume: number;
  coldTemp: number;
  hotTemp: number;
  power: number;
  efficiency: number;
  electricityCost: number;
}

export const Water_heater_calculatorInputSchema = z.object({
  volume: z.number().default(150),
  coldTemp: z.number().default(15),
  hotTemp: z.number().default(60),
  power: z.number().default(3),
  efficiency: z.number().default(95),
  electricityCost: z.number().default(0.15),
});

function evaluateAllFormulas(input: Water_heater_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volume * 4.186 * (input.hotTemp - input.coldTemp) / 3600; results["energyRequired"] = Number.isFinite(v) ? v : 0; } catch { results["energyRequired"] = 0; }
  try { const v = (results["energyRequired"] ?? 0) / (input.efficiency / 100); results["actualEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["actualEnergy"] = 0; }
  try { const v = (results["actualEnergy"] ?? 0) / input.power; results["heatUpTime"] = Number.isFinite(v) ? v : 0; } catch { results["heatUpTime"] = 0; }
  try { const v = (results["actualEnergy"] ?? 0) * input.electricityCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateWater_heater_calculator(input: Water_heater_calculatorInput): Water_heater_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Water_heater_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
