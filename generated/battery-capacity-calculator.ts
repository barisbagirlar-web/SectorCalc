// Auto-generated from battery-capacity-calculator-schema.json
import * as z from 'zod';

export interface Battery_capacity_calculatorInput {
  loadPower: number;
  backupTime: number;
  voltage: number;
  efficiency: number;
  depthOfDischarge: number;
}

export const Battery_capacity_calculatorInputSchema = z.object({
  loadPower: z.number().default(100),
  backupTime: z.number().default(1),
  voltage: z.number().default(12),
  efficiency: z.number().default(0.9),
  depthOfDischarge: z.number().default(0.8),
});

function evaluateAllFormulas(input: Battery_capacity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.loadPower * input.backupTime) / (input.voltage * input.efficiency * input.depthOfDischarge); results["capacityAh"] = Number.isFinite(v) ? v : 0; } catch { results["capacityAh"] = 0; }
  try { const v = (input.loadPower * input.backupTime) / (input.efficiency * input.depthOfDischarge); results["energyWh"] = Number.isFinite(v) ? v : 0; } catch { results["energyWh"] = 0; }
  results["__energyWh_toFixed_2___Wh"] = 0;
  results["__capacityAh_toFixed_2___Ah"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateBattery_capacity_calculator(input: Battery_capacity_calculatorInput): Battery_capacity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Battery_capacity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
