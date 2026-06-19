// Auto-generated from manning-equation-calculator-schema.json
import * as z from 'zod';

export interface Manning_equation_calculatorInput {
  roughness: number;
  hydraulicRadius: number;
  area: number;
  slope: number;
  dataConfidence?: number;
}

export const Manning_equation_calculatorInputSchema = z.object({
  roughness: z.number().default(0.013),
  hydraulicRadius: z.number().default(1),
  area: z.number().default(1),
  slope: z.number().default(0.001),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Manning_equation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roughness * input.hydraulicRadius * input.area * input.slope; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.roughness * input.hydraulicRadius * input.area * input.slope; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateManning_equation_calculator(input: Manning_equation_calculatorInput): Manning_equation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Manning_equation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
