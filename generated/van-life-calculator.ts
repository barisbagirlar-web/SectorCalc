// Auto-generated from van-life-calculator-schema.json
import * as z from 'zod';

export interface Van_life_calculatorInput {
  dailyEnergyWh: number;
  sunPeakHours: number;
  panelWattage: number;
  tiltAngleDeviation: number;
  systemEfficiency: number;
  daysAutonomy: number;
  batteryVoltage: number;
  depthOfDischarge: number;
  dataConfidence?: number;
}

export const Van_life_calculatorInputSchema = z.object({
  dailyEnergyWh: z.number().default(1000),
  sunPeakHours: z.number().default(5),
  panelWattage: z.number().default(300),
  tiltAngleDeviation: z.number().default(0),
  systemEfficiency: z.number().default(80),
  daysAutonomy: z.number().default(2),
  batteryVoltage: z.number().default(12),
  depthOfDischarge: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Van_life_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyEnergyWh / (input.sunPeakHours * input.systemEfficiency / 100); results["requiredTotalWattage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredTotalWattage"] = Number.NaN; }
  try { const v = (input.dailyEnergyWh * input.daysAutonomy) / (input.batteryVoltage * (input.depthOfDischarge / 100)); results["requiredBatteryCapacityAh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredBatteryCapacityAh"] = Number.NaN; }
  return results;
}


export function calculateVan_life_calculator(input: Van_life_calculatorInput): Van_life_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredTotalWattage"]);
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


export interface Van_life_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
