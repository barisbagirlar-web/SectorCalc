// @ts-nocheck
// Auto-generated from pump-power-calculator-schema.json
import * as z from 'zod';

export interface Pump_power_calculatorInput {
  flowRate: number;
  head: number;
  density: number;
  pumpEfficiency: number;
  motorEfficiency: number;
  safetyFactor: number;
}

export const Pump_power_calculatorInputSchema = z.object({
  flowRate: z.number().default(0.01),
  head: z.number().default(10),
  density: z.number().default(1000),
  pumpEfficiency: z.number().default(0.7),
  motorEfficiency: z.number().default(0.95),
  safetyFactor: z.number().default(1.1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pump_power_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.density * 9.81 * input.flowRate * input.head; results["hydraulicPower"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hydraulicPower"] = 0; }
  try { const v = input.density * 9.81 * input.flowRate * input.head / input.pumpEfficiency; results["shaftPower"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["shaftPower"] = 0; }
  try { const v = (input.density * 9.81 * input.flowRate * input.head) / (input.pumpEfficiency * input.motorEfficiency); results["motorInputPower"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["motorInputPower"] = 0; }
  try { const v = (input.density * 9.81 * input.flowRate * input.head * input.safetyFactor) / (input.pumpEfficiency * input.motorEfficiency); results["totalRequiredPower"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalRequiredPower"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePump_power_calculator(input: Pump_power_calculatorInput): Pump_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRequiredPower"]);
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


export interface Pump_power_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
