// Auto-generated from motor-calculator-schema.json
import * as z from 'zod';

export interface Motor_calculatorInput {
  voltage: number;
  current: number;
  powerFactor: number;
  efficiency: number;
  speed: number;
  numberOfPhases: number;
  dataConfidence?: number;
}

export const Motor_calculatorInputSchema = z.object({
  voltage: z.number().default(400),
  current: z.number().default(10),
  powerFactor: z.number().default(0.85),
  efficiency: z.number().default(90),
  speed: z.number().default(1450),
  numberOfPhases: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Motor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.voltage * input.current * input.powerFactor * (input.efficiency / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.voltage * input.current * input.powerFactor * (input.efficiency / 100) * (input.speed * input.numberOfPhases); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.speed * input.numberOfPhases; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMotor_calculator(input: Motor_calculatorInput): Motor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Motor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
