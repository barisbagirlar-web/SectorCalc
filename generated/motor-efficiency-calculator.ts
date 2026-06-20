// Auto-generated from motor-efficiency-calculator-schema.json
import * as z from 'zod';

export interface Motor_efficiency_calculatorInput {
  voltage: number;
  current: number;
  powerFactor: number;
  phases: number;
  torque: number;
  speed: number;
  dataConfidence?: number;
}

export const Motor_efficiency_calculatorInputSchema = z.object({
  voltage: z.number().default(400),
  current: z.number().default(10),
  powerFactor: z.number().default(0.85),
  phases: z.number().default(3),
  torque: z.number().default(50),
  speed: z.number().default(1450),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Motor_efficiency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.voltage) * (input.current) * (input.powerFactor) * (input.phases) * (input.torque) * (input.speed); results["outputPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["outputPower"] = Number.NaN; }
  try { const v = (input.voltage) * (input.current) * (input.powerFactor); results["outputPower_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["outputPower_aux"] = Number.NaN; }
  return results;
}


export function calculateMotor_efficiency_calculator(input: Motor_efficiency_calculatorInput): Motor_efficiency_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["outputPower_aux"]);
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


export interface Motor_efficiency_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
