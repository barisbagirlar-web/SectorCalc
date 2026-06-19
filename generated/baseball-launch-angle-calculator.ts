// Auto-generated from baseball-launch-angle-calculator-schema.json
import * as z from 'zod';

export interface Baseball_launch_angle_calculatorInput {
  initialVelocity: number;
  launchAngle: number;
  initialHeight: number;
  gravity: number;
  dataConfidence?: number;
}

export const Baseball_launch_angle_calculatorInputSchema = z.object({
  initialVelocity: z.number().default(42),
  launchAngle: z.number().default(30),
  initialHeight: z.number().default(1),
  gravity: z.number().default(9.81),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Baseball_launch_angle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialVelocity * input.launchAngle * input.initialHeight * input.gravity; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.initialVelocity * input.launchAngle * input.initialHeight * input.gravity; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBaseball_launch_angle_calculator(input: Baseball_launch_angle_calculatorInput): Baseball_launch_angle_calculatorOutput {
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


export interface Baseball_launch_angle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
