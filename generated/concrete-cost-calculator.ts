// Auto-generated from concrete-cost-calculator-schema.json
import * as z from 'zod';

export interface Concrete_cost_calculatorInput {
  length: number;
  width: number;
  thickness: number;
  costPerCubicMeter: number;
  wastePercentage: number;
  deliveryCost: number;
  dataConfidence?: number;
}

export const Concrete_cost_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(5),
  thickness: z.number().default(0.15),
  costPerCubicMeter: z.number().default(120),
  wastePercentage: z.number().default(5),
  deliveryCost: z.number().default(200),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Concrete_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * input.thickness; results["volume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["volume"])) * (1 + input.wastePercentage / 100); results["effectiveVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveVolume"])) * input.costPerCubicMeter; results["materialCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["materialCost"])) + input.deliveryCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateConcrete_cost_calculator(input: Concrete_cost_calculatorInput): Concrete_cost_calculatorOutput {
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


export interface Concrete_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
