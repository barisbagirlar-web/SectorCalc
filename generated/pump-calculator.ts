// @ts-nocheck
// Auto-generated from pump-calculator-schema.json
import * as z from 'zod';

export interface Pump_calculatorInput {
  flowRate: number;
  head: number;
  density: number;
  pumpEfficiency: number;
  motorEfficiency: number;
}

export const Pump_calculatorInputSchema = z.object({
  flowRate: z.number().default(100),
  head: z.number().default(20),
  density: z.number().default(1000),
  pumpEfficiency: z.number().default(75),
  motorEfficiency: z.number().default(90),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pump_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.flowRate / 3600 * input.head * input.density * 9.81 / 1000; results["hydraulicPower"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hydraulicPower"] = 0; }
  try { const v = input.flowRate / 3600 * input.head * input.density * 9.81 / 1000 / (input.pumpEfficiency / 100); results["shaftPower"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["shaftPower"] = 0; }
  try { const v = input.flowRate / 3600 * input.head * input.density * 9.81 / 1000 / (input.pumpEfficiency / 100) / (input.motorEfficiency / 100); results["motorPower"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["motorPower"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePump_calculator(input: Pump_calculatorInput): Pump_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["motorPower"]);
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


export interface Pump_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
