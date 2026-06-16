// Auto-generated from boxing-punch-speed-calculator-schema.json
import * as z from 'zod';

export interface Boxing_punch_speed_calculatorInput {
  arm_length: number;
  arm_angle: number;
  hip_angle: number;
  step_length: number;
  punch_time: number;
}

export const Boxing_punch_speed_calculatorInputSchema = z.object({
  arm_length: z.number().default(0.7),
  arm_angle: z.number().default(90),
  hip_angle: z.number().default(45),
  step_length: z.number().default(0.2),
  punch_time: z.number().default(0.15),
});

function evaluateAllFormulas(input: Boxing_punch_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.arm_length * ((input.arm_angle + input.hip_angle) * Math.PI / 180) + input.step_length) / input.punch_time; results["Punch Speed (m/s)"] = Number.isFinite(v) ? v : 0; } catch { results["Punch Speed (m/s)"] = 0; }
  try { const v = ((input.arm_length * ((input.arm_angle + input.hip_angle) * Math.PI / 180) + input.step_length) / input.punch_time) * 2.23694; results["Punch Speed (mph)"] = Number.isFinite(v) ? v : 0; } catch { results["Punch Speed (mph)"] = 0; }
  try { const v = input.arm_length * ((input.arm_angle + input.hip_angle) * Math.PI / 180); results["Angular Distance (m)"] = Number.isFinite(v) ? v : 0; } catch { results["Angular Distance (m)"] = 0; }
  try { const v = input.arm_length * ((input.arm_angle + input.hip_angle) * Math.PI / 180) + input.step_length; results["Total Distance (m)"] = Number.isFinite(v) ? v : 0; } catch { results["Total Distance (m)"] = 0; }
  return results;
}


export function calculateBoxing_punch_speed_calculator(input: Boxing_punch_speed_calculatorInput): Boxing_punch_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Punch"] ?? 0;
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


export interface Boxing_punch_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
