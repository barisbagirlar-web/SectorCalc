// Auto-generated from build-calculator-schema.json
import * as z from 'zod';

export interface Build_calculatorInput {
  length: number;
  width: number;
  height: number;
  density: number;
  wasteFactor: number;
  laborRate: number;
  laborHours: number;
  dataConfidence?: number;
}

export const Build_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(5),
  height: z.number().default(3),
  density: z.number().default(2400),
  wasteFactor: z.number().default(5),
  laborRate: z.number().default(25),
  laborHours: z.number().default(40),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Build_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * input.height; results["volume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = (asFormulaNumber(results["volume"])) * input.density; results["materialMass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["materialMass"] = 0; }
  try { const v = (asFormulaNumber(results["materialMass"])) * (input.wasteFactor / 100); results["wasteMass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteMass"] = 0; }
  try { const v = (asFormulaNumber(results["materialMass"])) + (asFormulaNumber(results["wasteMass"])); results["totalMaterialMass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMaterialMass"] = 0; }
  try { const v = input.laborRate * input.laborHours; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalMaterialMass"])) * 0.5 + (asFormulaNumber(results["laborCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBuild_calculator(input: Build_calculatorInput): Build_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCost"]));
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


export interface Build_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
