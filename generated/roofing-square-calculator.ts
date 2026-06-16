// Auto-generated from roofing-square-calculator-schema.json
import * as z from 'zod';

export interface Roofing_square_calculatorInput {
  roofLength: number;
  roofWidth: number;
  pitchAngle: number;
  wastePercent: number;
}

export const Roofing_square_calculatorInputSchema = z.object({
  roofLength: z.number().default(30),
  roofWidth: z.number().default(20),
  pitchAngle: z.number().default(20),
  wastePercent: z.number().default(10),
});

function evaluateAllFormulas(input: Roofing_square_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roofLength * input.roofWidth * (1 / Math.cos(input.pitchAngle * Math.PI / 180)); results["roofArea"] = Number.isFinite(v) ? v : 0; } catch { results["roofArea"] = 0; }
  try { const v = (results["roofArea"] ?? 0) * (input.wastePercent / 100); results["wasteArea"] = Number.isFinite(v) ? v : 0; } catch { results["wasteArea"] = 0; }
  try { const v = (results["roofArea"] ?? 0) + (results["wasteArea"] ?? 0); results["totalArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  try { const v = (results["totalArea"] ?? 0) / 100; results["roofingSquares"] = Number.isFinite(v) ? v : 0; } catch { results["roofingSquares"] = 0; }
  return results;
}


export function calculateRoofing_square_calculator(input: Roofing_square_calculatorInput): Roofing_square_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roofingSquares"] ?? 0;
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


export interface Roofing_square_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
