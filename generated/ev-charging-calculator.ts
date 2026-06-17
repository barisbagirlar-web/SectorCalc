// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ev_charging_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (((input.batteryCapacity * (input.desiredCharge - input.currentCharge) / 100) * (100 / input.efficiency)) / input.chargingPower); results["charging-time"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["charging-time"] = 0; }
  try { const v = ((input.batteryCapacity * (input.desiredCharge - input.currentCharge) / 100) * (100 / input.efficiency)); results["energy-required"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["energy-required"] = 0; }
  try { const v = (((input.batteryCapacity * (input.desiredCharge - input.currentCharge) / 100) * (100 / input.efficiency)) * input.electricityCost); results["total-cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total-cost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEv_charging_calculator(input: Ev_charging_calculatorInput): Ev_charging_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["charging"]);
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


export interface Ev_charging_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
