// Auto-generated from lexile-calculator-schema.json
import * as z from 'zod';

export interface Lexile_calculatorInput {
  tensileStrength: number;
  thickness: number;
  width: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Lexile_calculatorInputSchema = z.object({
  tensileStrength: z.number().default(500),
  thickness: z.number().default(2),
  width: z.number().default(10),
  safetyFactor: z.number().default(1.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lexile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.thickness * input.width; results["stressArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stressArea"] = 0; }
  try { const v = input.tensileStrength * (asFormulaNumber(results["stressArea"])); results["nominalLoad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["nominalLoad"] = 0; }
  try { const v = (asFormulaNumber(results["nominalLoad"])) / input.safetyFactor; results["allowableLoad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["allowableLoad"] = 0; }
  try { const v = (asFormulaNumber(results["allowableLoad"])) / 1000; results["lexileIndex"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lexileIndex"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLexile_calculator(input: Lexile_calculatorInput): Lexile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["lexileIndex"]);
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


export interface Lexile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
