// Auto-generated from surface-area-calculator-schema.json
import * as z from 'zod';

export interface Surface_area_calculatorInput {
  bottomLength: number;
  bottomWidth: number;
  topLength: number;
  topWidth: number;
  height: number;
  dataConfidence?: number;
}

export const Surface_area_calculatorInputSchema = z.object({
  bottomLength: z.number().default(2),
  bottomWidth: z.number().default(1.5),
  topLength: z.number().default(1),
  topWidth: z.number().default(0.8),
  height: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Surface_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bottomLength * input.bottomWidth; results["bottomArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bottomArea"] = 0; }
  try { const v = input.topLength * input.topWidth; results["topArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["topArea"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSurface_area_calculator(input: Surface_area_calculatorInput): Surface_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["topArea"]));
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


export interface Surface_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
