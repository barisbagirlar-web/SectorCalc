// Auto-generated from extension-spring-calculator-schema.json
import * as z from 'zod';

export interface Extension_spring_calculatorInput {
  wireDiameter: number;
  outerDiameter: number;
  totalCoils: number;
  shearModulus: number;
  allowableStress: number;
}

export const Extension_spring_calculatorInputSchema = z.object({
  wireDiameter: z.number().default(2),
  outerDiameter: z.number().default(20),
  totalCoils: z.number().default(15),
  shearModulus: z.number().default(79000),
  allowableStress: z.number().default(600),
});

function evaluateAllFormulas(input: Extension_spring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.outerDiameter - input.wireDiameter; results["meanDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["meanDiameter"] = 0; }
  try { const v = (results["meanDiameter"] ?? 0) / input.wireDiameter; results["springIndex"] = Number.isFinite(v) ? v : 0; } catch { results["springIndex"] = 0; }
  try { const v = input.totalCoils - 2; results["activeCoils"] = Number.isFinite(v) ? v : 0; } catch { results["activeCoils"] = 0; }
  try { const v = (4*(results["springIndex"] ?? 0) - 1) / (4*(results["springIndex"] ?? 0) - 4) + 0.615 / (results["springIndex"] ?? 0); results["wahlFactor"] = Number.isFinite(v) ? v : 0; } catch { results["wahlFactor"] = 0; }
  try { const v = (input.shearModulus * Math.pow(input.wireDiameter, 4)) / (8 * Math.pow((results["meanDiameter"] ?? 0), 3) * (results["activeCoils"] ?? 0)); results["springRate"] = Number.isFinite(v) ? v : 0; } catch { results["springRate"] = 0; }
  try { const v = (input.allowableStress * Math.PI * Math.pow(input.wireDiameter, 3)) / (8 * (results["meanDiameter"] ?? 0) * (results["wahlFactor"] ?? 0)); results["maxLoad"] = Number.isFinite(v) ? v : 0; } catch { results["maxLoad"] = 0; }
  return results;
}


export function calculateExtension_spring_calculator(input: Extension_spring_calculatorInput): Extension_spring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["springRate"] ?? 0;
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


export interface Extension_spring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
