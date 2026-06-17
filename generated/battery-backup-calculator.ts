// @ts-nocheck
// Auto-generated from battery-backup-calculator-schema.json
import * as z from 'zod';

export interface Battery_backup_calculatorInput {
  loadPower: number;
  systemVoltage: number;
  batteryCapacityAh: number;
  depthOfDischarge: number;
  inverterEfficiency: number;
  safetyFactor: number;
  temperatureDerating: number;
}

export const Battery_backup_calculatorInputSchema = z.object({
  loadPower: z.number().default(100),
  systemVoltage: z.number().default(12),
  batteryCapacityAh: z.number().default(100),
  depthOfDischarge: z.number().default(50),
  inverterEfficiency: z.number().default(90),
  safetyFactor: z.number().default(1),
  temperatureDerating: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Battery_backup_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.batteryCapacityAh * input.systemVoltage * input.safetyFactor * input.temperatureDerating; results["totalBatteryEnergyWh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalBatteryEnergyWh"] = 0; }
  try { const v = (asFormulaNumber(results["totalBatteryEnergyWh"])) * (input.depthOfDischarge / 100) * (input.inverterEfficiency / 100); results["usableEnergyWh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["usableEnergyWh"] = 0; }
  try { const v = (asFormulaNumber(results["usableEnergyWh"])) / input.loadPower; results["estimatedBackupTimeHours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["estimatedBackupTimeHours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBattery_backup_calculator(input: Battery_backup_calculatorInput): Battery_backup_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["estimatedBackupTimeHours"]);
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


export interface Battery_backup_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
