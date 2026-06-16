// Auto-generated from ups-calculator-schema.json
import * as z from 'zod';

export interface Ups_calculatorInput {
  totalLoad: number;
  powerFactor: number;
  requiredRuntime: number;
  inverterEfficiency: number;
  batteryVoltage: number;
  depthOfDischarge: number;
  numberOfBatteries: number;
}

export const Ups_calculatorInputSchema = z.object({
  totalLoad: z.number().default(500),
  powerFactor: z.number().default(0.8),
  requiredRuntime: z.number().default(30),
  inverterEfficiency: z.number().default(90),
  batteryVoltage: z.number().default(12),
  depthOfDischarge: z.number().default(50),
  numberOfBatteries: z.number().default(1),
});

function evaluateAllFormulas(input: Ups_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalLoad / input.powerFactor; results["totalVA"] = Number.isFinite(v) ? v : 0; } catch { results["totalVA"] = 0; }
  try { const v = (input.totalLoad / input.powerFactor) / input.batteryVoltage; results["loadCurrent"] = Number.isFinite(v) ? v : 0; } catch { results["loadCurrent"] = 0; }
  try { const v = (input.totalLoad * input.requiredRuntime) / 60; results["batteryWattHours"] = Number.isFinite(v) ? v : 0; } catch { results["batteryWattHours"] = 0; }
  try { const v = (input.totalLoad * input.requiredRuntime) / 60 / (input.inverterEfficiency / 100) / (input.depthOfDischarge / 100); results["adjustedWattHours"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedWattHours"] = 0; }
  try { const v = (((input.totalLoad * input.requiredRuntime) / 60) / ((input.inverterEfficiency / 100) * (input.depthOfDischarge / 100))) / input.batteryVoltage; results["totalRequiredAh"] = Number.isFinite(v) ? v : 0; } catch { results["totalRequiredAh"] = 0; }
  try { const v = (((input.totalLoad * input.requiredRuntime) / 60) / ((input.inverterEfficiency / 100) * (input.depthOfDischarge / 100)) / input.batteryVoltage) / input.numberOfBatteries; results["perBatteryCapacityAh"] = Number.isFinite(v) ? v : 0; } catch { results["perBatteryCapacityAh"] = 0; }
  return results;
}


export function calculateUps_calculator(input: Ups_calculatorInput): Ups_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["perBatteryCapacityAh"] ?? 0;
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


export interface Ups_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
