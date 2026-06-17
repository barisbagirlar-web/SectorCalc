// @ts-nocheck
// Auto-generated from capacitor-calculator-schema.json
import * as z from 'zod';

export interface Capacitor_calculatorInput {
  capacitance: number;
  voltage: number;
  resistance: number;
  frequency: number;
  time: number;
}

export const Capacitor_calculatorInputSchema = z.object({
  capacitance: z.number().default(0.001),
  voltage: z.number().default(12),
  resistance: z.number().default(1000),
  frequency: z.number().default(50),
  time: z.number().default(0.001),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Capacitor_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 0.5 * input.capacitance * input.voltage ** 2; results["energy_stored"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["energy_stored"] = 0; }
  try { const v = input.capacitance * input.voltage; results["charge"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["charge"] = 0; }
  try { const v = input.resistance * input.capacitance; results["time_constant"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["time_constant"] = 0; }
  try { const v = 1 / (2 * Math.PI * input.frequency * input.capacitance); results["reactance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["reactance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCapacitor_calculator(input: Capacitor_calculatorInput): Capacitor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["energy_stored"]);
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


export interface Capacitor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
