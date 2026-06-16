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

function evaluateAllFormulas(input: Van_life_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.panelWattage * Math.cos(input.tiltAngleDeviation * Math.PI / 180); results["adjustedPanelWattage"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedPanelWattage"] = 0; }
  try { const v = input.dailyEnergyWh / (input.sunPeakHours * input.systemEfficiency / 100); results["requiredTotalWattage"] = Number.isFinite(v) ? v : 0; } catch { results["requiredTotalWattage"] = 0; }
  try { const v = Math.ceil((results["requiredTotalWattage"] ?? 0) / (results["adjustedPanelWattage"] ?? 0)); results["numberOfPanels"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfPanels"] = 0; }
  try { const v = (input.dailyEnergyWh * input.daysAutonomy) / (input.batteryVoltage * (input.depthOfDischarge / 100)); results["requiredBatteryCapacityAh"] = Number.isFinite(v) ? v : 0; } catch { results["requiredBatteryCapacityAh"] = 0; }
  return results;
}


export function calculateVan_life_calculator(input: Van_life_calculatorInput): Van_life_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredTotalWattage"] ?? 0;
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


export interface Van_life_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
