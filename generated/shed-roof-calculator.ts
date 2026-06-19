// Auto-generated from shed-roof-calculator-schema.json
import * as z from 'zod';

export interface Shed_roof_calculatorInput {
  roofLength: number;
  roofWidth: number;
  slopeAngle: number;
  overhang: number;
  dataConfidence?: number;
}

export const Shed_roof_calculatorInputSchema = z.object({
  roofLength: z.number().default(10),
  roofWidth: z.number().default(6),
  slopeAngle: z.number().default(15),
  overhang: z.number().default(0.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Shed_roof_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.slopeAngle * Math.PI / 180; results["rad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rad"] = 0; }
  try { const v = input.roofWidth + 2 * input.overhang; results["totalWidth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWidth"] = 0; }
  try { const v = input.roofLength + 2 * input.overhang; results["totalLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalLength"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateShed_roof_calculator(input: Shed_roof_calculatorInput): Shed_roof_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalLength"]);
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


export interface Shed_roof_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
