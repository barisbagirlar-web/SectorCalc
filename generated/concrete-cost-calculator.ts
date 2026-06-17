// @ts-nocheck
// Auto-generated from concrete-cost-calculator-schema.json
import * as z from 'zod';

export interface Concrete_cost_calculatorInput {
  length: number;
  width: number;
  thickness: number;
  costPerCubicMeter: number;
  wastePercentage: number;
  deliveryCost: number;
}

export const Concrete_cost_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(5),
  thickness: z.number().default(0.15),
  costPerCubicMeter: z.number().default(120),
  wastePercentage: z.number().default(5),
  deliveryCost: z.number().default(200),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Concrete_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.length * input.width * input.thickness; results["volume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["volume"] = 0; }
  try { const v = (asFormulaNumber(results["volume"])) * (1 + input.wastePercentage / 100); results["effectiveVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveVolume"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveVolume"])) * input.costPerCubicMeter; results["materialCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = (asFormulaNumber(results["materialCost"])) + input.deliveryCost; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateConcrete_cost_calculator(input: Concrete_cost_calculatorInput): Concrete_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
