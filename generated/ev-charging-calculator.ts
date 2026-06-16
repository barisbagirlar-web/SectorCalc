// Auto-generated from ev-charging-calculator-schema.json
import * as z from 'zod';

export interface Ev_charging_calculatorInput {
  batteryCapacity: number;
  currentCharge: number;
  desiredCharge: number;
  chargingPower: number;
  electricityCost: number;
  efficiency: number;
}

export const Ev_charging_calculatorInputSchema = z.object({
  batteryCapacity: z.number().default(75),
  currentCharge: z.number().default(20),
  desiredCharge: z.number().default(80),
  chargingPower: z.number().default(50),
  electricityCost: z.number().default(0.15),
  efficiency: z.number().default(90),
});

function evaluateAllFormulas(input: Ev_charging_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (((input.batteryCapacity * (input.desiredCharge - input.currentCharge) / 100) * (100 / input.efficiency)) / input.chargingPower); results["charging-time"] = Number.isFinite(v) ? v : 0; } catch { results["charging-time"] = 0; }
  try { const v = ((input.batteryCapacity * (input.desiredCharge - input.currentCharge) / 100) * (100 / input.efficiency)); results["energy-required"] = Number.isFinite(v) ? v : 0; } catch { results["energy-required"] = 0; }
  try { const v = (((input.batteryCapacity * (input.desiredCharge - input.currentCharge) / 100) * (100 / input.efficiency)) * input.electricityCost); results["total-cost"] = Number.isFinite(v) ? v : 0; } catch { results["total-cost"] = 0; }
  return results;
}


export function calculateEv_charging_calculator(input: Ev_charging_calculatorInput): Ev_charging_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["charging"] ?? 0;
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


export interface Ev_charging_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
