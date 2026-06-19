// Auto-generated from gear-ratio-calculator-schema.json
import * as z from 'zod';

export interface Gear_ratio_calculatorInput {
  drivingTeeth: number;
  drivenTeeth: number;
  inputSpeed: number;
  inputTorque: number;
  efficiency: number;
  dataConfidence?: number;
}

export const Gear_ratio_calculatorInputSchema = z.object({
  drivingTeeth: z.number().default(20),
  drivenTeeth: z.number().default(40),
  inputSpeed: z.number().default(1000),
  inputTorque: z.number().default(50),
  efficiency: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gear_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.drivenTeeth / input.drivingTeeth; results["ratio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ratio"] = 0; }
  try { const v = input.inputSpeed / (input.drivenTeeth / input.drivingTeeth); results["outputSpeed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["outputSpeed"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGear_ratio_calculator(input: Gear_ratio_calculatorInput): Gear_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["ratio"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Gear_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
