// Auto-generated from critical-point-calculator-schema.json
import * as z from 'zod';

export interface Critical_point_calculatorInput {
  a: number;
  b: number;
  c: number;
  d: number;
}

export const Critical_point_calculatorInputSchema = z.object({
  a: z.number().default(1),
  b: z.number().default(-2),
  c: z.number().default(-3),
  d: z.number().default(0),
});

function evaluateAllFormulas(input: Critical_point_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 4*input.b*input.b - 12*input.a*input.c; results["discriminant"] = Number.isFinite(v) ? v : 0; } catch { results["discriminant"] = 0; }
  try { const v = (results["discriminant"] ?? 0) >= 0; results["hasReal"] = Number.isFinite(v) ? v : 0; } catch { results["hasReal"] = 0; }
  try { const v = (results["hasReal"] ?? 0) ? (-2*input.b + Math.sqrt((results["discriminant"] ?? 0))) / (6*input.a) : NaN; results["x1"] = Number.isFinite(v) ? v : 0; } catch { results["x1"] = 0; }
  try { const v = (results["hasReal"] ?? 0) ? (-2*input.b - Math.sqrt((results["discriminant"] ?? 0))) / (6*input.a) : NaN; results["x2"] = Number.isFinite(v) ? v : 0; } catch { results["x2"] = 0; }
  try { const v = (results["hasReal"] ?? 0) ? ((results["discriminant"] ?? 0) === 0 ? 'One real critical point: x = ' + (results["x1"] ?? 0) : 'Two real critical points: x₁ = ' + (results["x1"] ?? 0) + ', x₂ = ' + (results["x2"] ?? 0)) : 'No real critical points'; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateCritical_point_calculator(input: Critical_point_calculatorInput): Critical_point_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Critical_point_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
