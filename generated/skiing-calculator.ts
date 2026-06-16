// Auto-generated from skiing-calculator-schema.json
import * as z from 'zod';

export interface Skiing_calculatorInput {
  verticalDrop: number;
  horizontalDistance: number;
  frictionCoeff: number;
  initialSpeed: number;
}

export const Skiing_calculatorInputSchema = z.object({
  verticalDrop: z.number().default(300),
  horizontalDistance: z.number().default(1000),
  frictionCoeff: z.number().default(0.05),
  initialSpeed: z.number().default(0),
});

function evaluateAllFormulas(input: Skiing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.atan(input.verticalDrop / input.horizontalDistance); results["slopeAngle"] = Number.isFinite(v) ? v : 0; } catch { results["slopeAngle"] = 0; }
  try { const v = Math.sqrt(input.verticalDrop**2 + input.horizontalDistance**2); results["slopeDistance"] = Number.isFinite(v) ? v : 0; } catch { results["slopeDistance"] = 0; }
  try { const v = 9.81 * (Math.sin((results["slopeAngle"] ?? 0)) - input.frictionCoeff * Math.cos((results["slopeAngle"] ?? 0))); results["acceleration"] = Number.isFinite(v) ? v : 0; } catch { results["acceleration"] = 0; }
  try { const v = Math.sqrt(Math.max(0, input.initialSpeed**2 + 2 * (results["acceleration"] ?? 0) * (results["slopeDistance"] ?? 0))); results["finalSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["finalSpeed"] = 0; }
  try { const v = (results["acceleration"] ?? 0) > 0 ? ((results["finalSpeed"] ?? 0) - input.initialSpeed) / (results["acceleration"] ?? 0) : Infinity; results["time"] = Number.isFinite(v) ? v : 0; } catch { results["time"] = 0; }
  return results;
}


export function calculateSkiing_calculator(input: Skiing_calculatorInput): Skiing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalSpeed"] ?? 0;
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


export interface Skiing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
