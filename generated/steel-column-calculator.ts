// Auto-generated from steel-column-calculator-schema.json
import * as z from 'zod';

export interface Steel_column_calculatorInput {
  effectiveLengthFactor: number;
  unbracedLength: number;
  width: number;
  thickness: number;
  elasticModulus: number;
  yieldStrength: number;
  safetyFactor: number;
}

export const Steel_column_calculatorInputSchema = z.object({
  effectiveLengthFactor: z.number().default(1),
  unbracedLength: z.number().default(3000),
  width: z.number().default(100),
  thickness: z.number().default(10),
  elasticModulus: z.number().default(200),
  yieldStrength: z.number().default(250),
  safetyFactor: z.number().default(1.67),
});

function evaluateAllFormulas(input: Steel_column_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.width * input.thickness; results["A"] = Number.isFinite(v) ? v : 0; } catch { results["A"] = 0; }
  try { const v = (input.width * Math.pow(input.thickness,3)) / 12; results["I"] = Number.isFinite(v) ? v : 0; } catch { results["I"] = 0; }
  try { const v = (Math.PI * Math.PI * input.elasticModulus * 1000 * (results["I"] ?? 0)) / Math.pow(input.effectiveLengthFactor * input.unbracedLength, 2); results["P_euler"] = Number.isFinite(v) ? v : 0; } catch { results["P_euler"] = 0; }
  try { const v = input.yieldStrength * (results["A"] ?? 0); results["P_yield"] = Number.isFinite(v) ? v : 0; } catch { results["P_yield"] = 0; }
  try { const v = Math.min((results["P_euler"] ?? 0), (results["P_yield"] ?? 0)); results["criticalLoad"] = Number.isFinite(v) ? v : 0; } catch { results["criticalLoad"] = 0; }
  try { const v = (results["criticalLoad"] ?? 0) / input.safetyFactor; results["allowableLoad"] = Number.isFinite(v) ? v : 0; } catch { results["allowableLoad"] = 0; }
  try { const v = (results["P_euler"] ?? 0) / (results["A"] ?? 0); results["eulerStress"] = Number.isFinite(v) ? v : 0; } catch { results["eulerStress"] = 0; }
  try { const v = input.yieldStrength; results["yieldStress"] = Number.isFinite(v) ? v : 0; } catch { results["yieldStress"] = 0; }
  return results;
}


export function calculateSteel_column_calculator(input: Steel_column_calculatorInput): Steel_column_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["allowableLoad"] ?? 0;
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


export interface Steel_column_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
