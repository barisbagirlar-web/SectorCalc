// Auto-generated from boxing-punch-speed-calculator-schema.json
import * as z from 'zod';

export interface Boxing_punch_speed_calculatorInput {
  arm_length: number;
  arm_angle: number;
  hip_angle: number;
  step_length: number;
  punch_time: number;
  dataConfidence?: number;
}

export const Boxing_punch_speed_calculatorInputSchema = z.object({
  arm_length: z.number().default(0.7),
  arm_angle: z.number().default(90),
  hip_angle: z.number().default(45),
  step_length: z.number().default(0.2),
  punch_time: z.number().default(0.15),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Boxing_punch_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.arm_length * ((input.arm_angle + input.hip_angle) * Math.PI / 180) + input.step_length) / input.punch_time; results["Punch Speed (m/s)"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Punch Speed (m/s)"] = 0; }
  try { const v = ((input.arm_length * ((input.arm_angle + input.hip_angle) * Math.PI / 180) + input.step_length) / input.punch_time) * 2.23694; results["Punch Speed (mph)"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Punch Speed (mph)"] = 0; }
  try { const v = input.arm_length * ((input.arm_angle + input.hip_angle) * Math.PI / 180); results["Angular Distance (m)"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Angular Distance (m)"] = 0; }
  try { const v = input.arm_length * ((input.arm_angle + input.hip_angle) * Math.PI / 180) + input.step_length; results["Total Distance (m)"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Total Distance (m)"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBoxing_punch_speed_calculator(input: Boxing_punch_speed_calculatorInput): Boxing_punch_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["Punch"]));
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


export interface Boxing_punch_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
