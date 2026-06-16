// Auto-generated from gradient-calculator-schema.json
import * as z from 'zod';

export interface Gradient_calculatorInput {
  startEasting: number;
  startNorthing: number;
  startElevation: number;
  endEasting: number;
  endNorthing: number;
  endElevation: number;
}

export const Gradient_calculatorInputSchema = z.object({
  startEasting: z.number().default(0),
  startNorthing: z.number().default(0),
  startElevation: z.number().default(0),
  endEasting: z.number().default(1),
  endNorthing: z.number().default(0),
  endElevation: z.number().default(1),
});

function evaluateAllFormulas(input: Gradient_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.endElevation - input.startElevation; results["rise"] = Number.isFinite(v) ? v : 0; } catch { results["rise"] = 0; }
  try { const v = Math.sqrt((input.endEasting - input.startEasting)**2 + (input.endNorthing - input.startNorthing)**2); results["run"] = Number.isFinite(v) ? v : 0; } catch { results["run"] = 0; }
  try { const v = Math.sqrt((results["rise"] ?? 0)**2 + (results["run"] ?? 0)**2); results["slopeDistance"] = Number.isFinite(v) ? v : 0; } catch { results["slopeDistance"] = 0; }
  try { const v = ((results["rise"] ?? 0) / (results["run"] ?? 0)) * 100; results["gradientPercent"] = Number.isFinite(v) ? v : 0; } catch { results["gradientPercent"] = 0; }
  try { const v = Math.atan((results["rise"] ?? 0) / (results["run"] ?? 0)) * (180 / Math.PI); results["gradientAngle"] = Number.isFinite(v) ? v : 0; } catch { results["gradientAngle"] = 0; }
  return results;
}


export function calculateGradient_calculator(input: Gradient_calculatorInput): Gradient_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["gradientPercent"] ?? 0;
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


export interface Gradient_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
