// Auto-generated from wrinkle-calculator-schema.json
import * as z from 'zod';

export interface Wrinkle_calculatorInput {
  thickness: number;
  blankDiameter: number;
  punchDiameter: number;
  drawDepth: number;
  yieldStrength: number;
  elasticModulus: number;
}

export const Wrinkle_calculatorInputSchema = z.object({
  thickness: z.number().default(1.5),
  blankDiameter: z.number().default(200),
  punchDiameter: z.number().default(100),
  drawDepth: z.number().default(50),
  yieldStrength: z.number().default(250),
  elasticModulus: z.number().default(210),
});

function evaluateAllFormulas(input: Wrinkle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.asin((input.blankDiameter - input.punchDiameter) / (2 * input.drawDepth)); results["drawAngle_rad"] = Number.isFinite(v) ? v : 0; } catch { results["drawAngle_rad"] = 0; }
  try { const v = (results["drawAngle_rad"] ?? 0) * 180 / Math.PI; results["drawAngle_deg"] = Number.isFinite(v) ? v : 0; } catch { results["drawAngle_deg"] = 0; }
  try { const v = Math.sqrt(input.yieldStrength / (input.elasticModulus * 1000)); results["factor"] = Number.isFinite(v) ? v : 0; } catch { results["factor"] = 0; }
  try { const v = (input.blankDiameter - input.punchDiameter) / (2 * Math.sin((results["drawAngle_rad"] ?? 0))) * (results["factor"] ?? 0); results["requiredThickness"] = Number.isFinite(v) ? v : 0; } catch { results["requiredThickness"] = 0; }
  try { const v = ((input.thickness - (results["requiredThickness"] ?? 0)) / (results["requiredThickness"] ?? 0)) * 100; results["safetyMargin"] = Number.isFinite(v) ? v : 0; } catch { results["safetyMargin"] = 0; }
  return results;
}


export function calculateWrinkle_calculator(input: Wrinkle_calculatorInput): Wrinkle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["safetyMargin"] ?? 0;
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


export interface Wrinkle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
