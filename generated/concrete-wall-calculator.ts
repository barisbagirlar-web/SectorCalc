// Auto-generated from concrete-wall-calculator-schema.json
import * as z from 'zod';

export interface Concrete_wall_calculatorInput {
  length: number;
  height: number;
  thickness: number;
  quantity: number;
  wasteFactor: number;
  costPerCubicMeter: number;
  dataConfidence?: number;
}

export const Concrete_wall_calculatorInputSchema = z.object({
  length: z.number().default(1),
  height: z.number().default(2.5),
  thickness: z.number().default(0.2),
  quantity: z.number().default(1),
  wasteFactor: z.number().default(5),
  costPerCubicMeter: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Concrete_wall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.height * input.thickness * input.quantity; results["netVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netVolume"] = 0; }
  try { const v = (asFormulaNumber(results["netVolume"])) * (1 + input.wasteFactor / 100); results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = (asFormulaNumber(results["totalVolume"])) - (asFormulaNumber(results["netVolume"])); results["wasteVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteVolume"] = 0; }
  try { const v = (asFormulaNumber(results["totalVolume"])) * input.costPerCubicMeter; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateConcrete_wall_calculator(input: Concrete_wall_calculatorInput): Concrete_wall_calculatorOutput {
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


export interface Concrete_wall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
