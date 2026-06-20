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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Battery_backup_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.batteryCapacityAh * input.systemVoltage * input.safetyFactor * input.temperatureDerating; results["totalBatteryEnergyWh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBatteryEnergyWh"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalBatteryEnergyWh"])) * (input.depthOfDischarge / 100) * (input.inverterEfficiency / 100); results["usableEnergyWh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["usableEnergyWh"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["usableEnergyWh"])) / input.loadPower; results["estimatedBackupTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["estimatedBackupTimeHours"] = Number.NaN; }
  return results;
}


export function calculateBattery_backup_calculator(input: Battery_backup_calculatorInput): Battery_backup_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["estimatedBackupTimeHours"]);
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


export interface Battery_backup_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
