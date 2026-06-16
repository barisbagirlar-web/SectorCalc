// Auto-generated from critical-angle-calculator-schema.json
import * as z from 'zod';

export interface Critical_angle_calculatorInput {
  n1: number;
  n2: number;
  outputUnit: number;
  precision: number;
}

export const Critical_angle_calculatorInputSchema = z.object({
  n1: z.number().default(1.5),
  n2: z.number().default(1),
  outputUnit: z.number().default(0),
  precision: z.number().default(2),
});

function evaluateAllFormulas(input: Critical_angle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.n2 / input.n1; results["ratio"] = Number.isFinite(v) ? v : 0; } catch { results["ratio"] = 0; }
  try { const v = Math.asin((results["ratio"] ?? 0)); results["asinRad"] = Number.isFinite(v) ? v : 0; } catch { results["asinRad"] = 0; }
  try { const v = (results["asinRad"] ?? 0); results["criticalAngleRad"] = Number.isFinite(v) ? v : 0; } catch { results["criticalAngleRad"] = 0; }
  try { const v = (results["asinRad"] ?? 0) * 180 / Math.PI; results["criticalAngleDeg"] = Number.isFinite(v) ? v : 0; } catch { results["criticalAngleDeg"] = 0; }
  try { const v = input.outputUnit === 0 ? (results["criticalAngleDeg"] ?? 0) : (results["criticalAngleRad"] ?? 0); results["finalAngle"] = Number.isFinite(v) ? v : 0; } catch { results["finalAngle"] = 0; }
  return results;
}


export function calculateCritical_angle_calculator(input: Critical_angle_calculatorInput): Critical_angle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalAngle"] ?? 0;
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


export interface Critical_angle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
