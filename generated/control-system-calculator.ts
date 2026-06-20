// Auto-generated from control-system-calculator-schema.json
import * as z from 'zod';

export interface Control_system_calculatorInput {
  setpoint: number;
  processVariable: number;
  proportionalGain: number;
  integralTime: number;
  derivativeTime: number;
  sampleTime: number;
  previousError: number;
  integralSum: number;
  dataConfidence?: number;
}

export const Control_system_calculatorInputSchema = z.object({
  setpoint: z.number().default(100),
  processVariable: z.number().default(95),
  proportionalGain: z.number().default(2),
  integralTime: z.number().default(5),
  derivativeTime: z.number().default(0.5),
  sampleTime: z.number().default(0.1),
  previousError: z.number().default(0),
  integralSum: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Control_system_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.setpoint - input.processVariable; results["error"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["error"] = Number.NaN; }
  try { const v = input.proportionalGain * (toNumericFormulaValue(results["error"])); results["proportionalOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["proportionalOutput"] = Number.NaN; }
  try { const v = input.proportionalGain * (input.sampleTime / input.integralTime) * ((toNumericFormulaValue(results["error"])) + input.previousError) / 2 + input.integralSum; results["integralOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["integralOutput"] = Number.NaN; }
  try { const v = input.proportionalGain * (input.derivativeTime / input.sampleTime) * ((toNumericFormulaValue(results["error"])) - input.previousError); results["derivativeOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["derivativeOutput"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["proportionalOutput"])) + (toNumericFormulaValue(results["integralOutput"])) + (toNumericFormulaValue(results["derivativeOutput"])); results["controllerOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["controllerOutput"] = Number.NaN; }
  return results;
}


export function calculateControl_system_calculator(input: Control_system_calculatorInput): Control_system_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["controllerOutput"]);
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


export interface Control_system_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
