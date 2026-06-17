// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Solar_battery_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.dailyEnergyConsumption * 1000 * input.daysOfAutonomy) / (input.depthOfDischarge * input.batteryEfficiency); results["requiredEnergyWh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["requiredEnergyWh"] = 0; }
  try { const v = (asFormulaNumber(results["requiredEnergyWh"])) / input.systemVoltage; results["requiredAh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["requiredAh"] = 0; }
  try { const v = (asFormulaNumber(results["requiredAh"])) / input.batteryCapacityAh; results["batteryCountExact"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["batteryCountExact"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSolar_battery_calculator(input: Solar_battery_calculatorInput): Solar_battery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredAh"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
