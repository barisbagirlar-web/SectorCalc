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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Extension_spring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.outerDiameter - input.wireDiameter; results["meanDiameter"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meanDiameter"] = 0; }
  try { const v = (asFormulaNumber(results["meanDiameter"])) / input.wireDiameter; results["springIndex"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["springIndex"] = 0; }
  try { const v = input.totalCoils - 2; results["activeCoils"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["activeCoils"] = 0; }
  try { const v = (4*(asFormulaNumber(results["springIndex"])) - 1) / (4*(asFormulaNumber(results["springIndex"])) - 4) + 0.615 / (asFormulaNumber(results["springIndex"])); results["wahlFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wahlFactor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateExtension_spring_calculator(input: Extension_spring_calculatorInput): Extension_spring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["wahlFactor"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Extension_spring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
