// Auto-generated from extension-spring-calculator-schema.json
import * as z from 'zod';

export interface Extension_spring_calculatorInput {
  wireDiameter: number;
  outerDiameter: number;
  totalCoils: number;
  shearModulus: number;
  allowableStress: number;
  dataConfidence?: number;
}

export const Extension_spring_calculatorInputSchema = z.object({
  wireDiameter: z.number().default(2),
  outerDiameter: z.number().default(20),
  totalCoils: z.number().default(15),
  shearModulus: z.number().default(79000),
  allowableStress: z.number().default(600),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Extension_spring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.outerDiameter - input.wireDiameter; results["meanDiameter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meanDiameter"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["meanDiameter"])) / input.wireDiameter; results["springIndex"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["springIndex"] = Number.NaN; }
  try { const v = input.totalCoils - 2; results["activeCoils"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["activeCoils"] = Number.NaN; }
  try { const v = (4*(toNumericFormulaValue(results["springIndex"])) - 1) / (4*(toNumericFormulaValue(results["springIndex"])) - 4) + 0.615 / (toNumericFormulaValue(results["springIndex"])); results["wahlFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wahlFactor"] = Number.NaN; }
  return results;
}


export function calculateExtension_spring_calculator(input: Extension_spring_calculatorInput): Extension_spring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["wahlFactor"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
