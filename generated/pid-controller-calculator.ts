// @ts-nocheck
// Auto-generated from pid-controller-calculator-schema.json
import * as z from 'zod';

export interface Pid_controller_calculatorInput {
  setpoint: number;
  processVariable: number;
  Kp: number;
  Ki: number;
  Kd: number;
  dt: number;
  previousError: number;
  integral: number;
}

export const Pid_controller_calculatorInputSchema = z.object({
  setpoint: z.number().default(100),
  processVariable: z.number().default(90),
  Kp: z.number().default(1),
  Ki: z.number().default(0.1),
  Kd: z.number().default(0.05),
  dt: z.number().default(0.1),
  previousError: z.number().default(10),
  integral: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pid_controller_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.Kp*(input.setpoint - input.processVariable) + input.Ki*(input.integral + (input.setpoint - input.processVariable)*input.dt) + input.Kd*((input.setpoint - input.processVariable) - input.previousError)/input.dt; results["primary"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.setpoint; results["breakdown"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePid_controller_calculator(input: Pid_controller_calculatorInput): Pid_controller_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["breakdown"]);
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


export interface Pid_controller_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
