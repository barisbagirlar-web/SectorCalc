// Auto-generated from solar-battery-calculator-schema.json
import * as z from 'zod';

export interface Solar_battery_calculatorInput {
  dailyEnergyConsumption: number;
  peakSunHours: number;
  systemVoltage: number;
  depthOfDischarge: number;
  daysOfAutonomy: number;
  batteryEfficiency: number;
  batteryCapacityAh: number;
}

export const Solar_battery_calculatorInputSchema = z.object({
  dailyEnergyConsumption: z.number().default(10),
  peakSunHours: z.number().default(5),
  systemVoltage: z.number().default(24),
  depthOfDischarge: z.number().default(0.5),
  daysOfAutonomy: z.number().default(3),
  batteryEfficiency: z.number().default(0.85),
  batteryCapacityAh: z.number().default(200),
});

function evaluateAllFormulas(input: Solar_battery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dailyEnergyConsumption * 1000 * input.daysOfAutonomy) / (input.depthOfDischarge * input.batteryEfficiency); results["requiredEnergyWh"] = Number.isFinite(v) ? v : 0; } catch { results["requiredEnergyWh"] = 0; }
  try { const v = (results["requiredEnergyWh"] ?? 0) / input.systemVoltage; results["requiredAh"] = Number.isFinite(v) ? v : 0; } catch { results["requiredAh"] = 0; }
  try { const v = (results["requiredAh"] ?? 0) / input.batteryCapacityAh; results["batteryCountExact"] = Number.isFinite(v) ? v : 0; } catch { results["batteryCountExact"] = 0; }
  return results;
}


export function calculateSolar_battery_calculator(input: Solar_battery_calculatorInput): Solar_battery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredAh"] ?? 0;
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


export interface Solar_battery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
