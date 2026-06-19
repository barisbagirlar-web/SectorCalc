// Auto-generated from bird-cage-calculator-schema.json
import * as z from 'zod';

export interface Bird_cage_calculatorInput {
  length: number;
  width: number;
  height: number;
  barSpacing: number;
  wireDiameter: number;
  dataConfidence?: number;
}

export const Bird_cage_calculatorInputSchema = z.object({
  length: z.number().default(60),
  width: z.number().default(40),
  height: z.number().default(50),
  barSpacing: z.number().default(1.5),
  wireDiameter: z.number().default(0.2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bird_cage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * (input.length * input.width + input.length * input.height + input.width * input.height); results["surfaceArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["surfaceArea"] = 0; }
  try { const v = (4 / input.barSpacing) * (input.width * input.height + input.length * input.height + input.length * input.width) + 4 * (input.length + input.width + input.height); results["totalWireLengthCm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWireLengthCm"] = 0; }
  try { const v = (asFormulaNumber(results["totalWireLengthCm"])) / 100; results["totalWireLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWireLength"] = 0; }
  try { const v = (asFormulaNumber(results["surfaceArea"])) / 10000; results["meshArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meshArea"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBird_cage_calculator(input: Bird_cage_calculatorInput): Bird_cage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["surfaceArea"]);
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


export interface Bird_cage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
