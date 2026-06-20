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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Solar_battery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dailyEnergyConsumption * 1000 * input.daysOfAutonomy) / (input.depthOfDischarge * input.batteryEfficiency); results["requiredEnergyWh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredEnergyWh"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["requiredEnergyWh"])) / input.systemVoltage; results["requiredAh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredAh"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["requiredAh"])) / input.batteryCapacityAh; results["batteryCountExact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["batteryCountExact"] = Number.NaN; }
  return results;
}


export function calculateSolar_battery_calculator(input: Solar_battery_calculatorInput): Solar_battery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredAh"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
