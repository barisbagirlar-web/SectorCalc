// Auto-generated from kp-calculator-schema.json
import * as z from 'zod';

export interface Kp_calculatorInput {
  processGain: number;
  timeConstant: number;
  deadTime: number;
  safetyFactor: number;
  controllerType: number;
  dataConfidence?: number;
}

export const Kp_calculatorInputSchema = z.object({
  processGain: z.number().default(1),
  timeConstant: z.number().default(10),
  deadTime: z.number().default(1),
  safetyFactor: z.number().default(1),
  controllerType: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (toNumericFormulaValue(results["Kp_raw"])) * input.safetyFactor; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["primary"] = Number.NaN; }
  try { const v = (input.controllerType === 1 ? (input.timeConstant / (input.processGain * input.deadTime)) : (input.controllerType === 2 ? (0.9 * input.timeConstant / (input.processGain * input.deadTime)) : (1.2 * input.timeConstant / (input.processGain * input.deadTime)))); results["Kp_raw"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Kp_raw"] = Number.NaN; }
  try { const v = (input.controllerType === 3 ? (0.6 * input.timeConstant / input.processGain) : 0); results["Kd"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Kd"] = Number.NaN; }
  return results;
}


export function calculateKp_calculator(input: Kp_calculatorInput): Kp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["primary"]);
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


export interface Kp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
