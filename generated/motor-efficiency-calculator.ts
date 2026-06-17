// @ts-nocheck
// Auto-generated from motor-efficiency-calculator-schema.json
import * as z from 'zod';

export interface Motor_efficiency_calculatorInput {
  voltage: number;
  current: number;
  powerFactor: number;
  phases: number;
  torque: number;
  speed: number;
}

export const Motor_efficiency_calculatorInputSchema = z.object({
  voltage: z.number().default(400),
  current: z.number().default(10),
  powerFactor: z.number().default(0.85),
  phases: z.number().default(3),
  torque: z.number().default(50),
  speed: z.number().default(1450),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Motor_efficiency_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.torque * input.speed * Math.PI * 2 / 60000; results["outputPower"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["outputPower"] = 0; }
  try { const v = input.torque * input.speed * Math.PI * 2 / 60000; results["outputPower_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["outputPower_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMotor_efficiency_calculator(input: Motor_efficiency_calculatorInput): Motor_efficiency_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["outputPower_aux"]);
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


export interface Motor_efficiency_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
