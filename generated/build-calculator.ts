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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Build_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * input.height; results["volume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["volume"])) * input.density; results["materialMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialMass"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["materialMass"])) * (input.wasteFactor / 100); results["wasteMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteMass"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["materialMass"])) + (toNumericFormulaValue(results["wasteMass"])); results["totalMaterialMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMaterialMass"] = Number.NaN; }
  try { const v = input.laborRate * input.laborHours; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalMaterialMass"])) * 0.5 + (toNumericFormulaValue(results["laborCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateBuild_calculator(input: Build_calculatorInput): Build_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Build_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
