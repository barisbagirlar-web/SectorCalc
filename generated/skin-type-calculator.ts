// Auto-generated from skin-type-calculator-schema.json
import * as z from 'zod';

export interface Skin_type_calculatorInput {
  oiliness: number;
  hydration: number;
  sensitivity: number;
  pigmentation: number;
  elasticity: number;
  dataConfidence?: number;
}

export const Skin_type_calculatorInputSchema = z.object({
  oiliness: z.number().default(2),
  hydration: z.number().default(2),
  sensitivity: z.number().default(2),
  pigmentation: z.number().default(2),
  elasticity: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Skin_type_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.oiliness + input.hydration) * 12.5; results["skinIndex"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["skinIndex"] = 0; }
  try { const v = input.sensitivity * 25; results["sensitivityIndex"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sensitivityIndex"] = 0; }
  try { const v = input.pigmentation * 25; results["pigmentationIndex"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pigmentationIndex"] = 0; }
  try { const v = (4 - input.elasticity) * 25; results["agingIndex"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["agingIndex"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSkin_type_calculator(input: Skin_type_calculatorInput): Skin_type_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["agingIndex"]));
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


export interface Skin_type_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
