// Auto-generated from gear-ratio-calculator-schema.json
import * as z from 'zod';

export interface Gear_ratio_calculatorInput {
  drivingTeeth: number;
  drivenTeeth: number;
  inputSpeed: number;
  inputTorque: number;
  efficiency: number;
}

export const Gear_ratio_calculatorInputSchema = z.object({
  drivingTeeth: z.number().default(20),
  drivenTeeth: z.number().default(40),
  inputSpeed: z.number().default(1000),
  inputTorque: z.number().default(50),
  efficiency: z.number().default(100),
});

function evaluateAllFormulas(input: Gear_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.drivenTeeth / input.drivingTeeth; results["ratio"] = Number.isFinite(v) ? v : 0; } catch { results["ratio"] = 0; }
  try { const v = input.inputSpeed / (input.drivenTeeth / input.drivingTeeth); results["outputSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["outputSpeed"] = 0; }
  try { const v = input.inputTorque * (input.drivenTeeth / input.drivingTeeth) * (Math.min(Math.max(input.efficiency, 0), 100) / 100); results["outputTorque"] = Number.isFinite(v) ? v : 0; } catch { results["outputTorque"] = 0; }
  results["__outputSpeed__RPM"] = 0;
  results["__outputTorque__Nm"] = 0;
  results["__ratio__1"] = 0;
  return results;
}


export function calculateGear_ratio_calculator(input: Gear_ratio_calculatorInput): Gear_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ratio"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
