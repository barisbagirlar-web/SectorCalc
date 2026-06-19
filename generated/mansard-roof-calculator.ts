// Auto-generated from mansard-roof-calculator-schema.json
import * as z from 'zod';

export interface Mansard_roof_calculatorInput {
  buildingWidth: number;
  buildingLength: number;
  lowerAngle: number;
  upperAngle: number;
  lowerHeight: number;
  dataConfidence?: number;
}

export const Mansard_roof_calculatorInputSchema = z.object({
  buildingWidth: z.number().default(10),
  buildingLength: z.number().default(15),
  lowerAngle: z.number().default(70),
  upperAngle: z.number().default(30),
  lowerHeight: z.number().default(2.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mansard_roof_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.buildingWidth / 2; results["halfSpan"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["halfSpan"] = 0; }
  try { const v = input.buildingWidth / 2; results["halfSpan_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["halfSpan_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMansard_roof_calculator(input: Mansard_roof_calculatorInput): Mansard_roof_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["halfSpan_aux"]);
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


export interface Mansard_roof_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
