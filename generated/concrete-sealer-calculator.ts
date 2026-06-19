// Auto-generated from concrete-sealer-calculator-schema.json
import * as z from 'zod';

export interface Concrete_sealer_calculatorInput {
  area: number;
  coverageRate: number;
  numCoats: number;
  wasteFactor: number;
  porosityFactor: number;
  pricePerUnit: number;
  dataConfidence?: number;
}

export const Concrete_sealer_calculatorInputSchema = z.object({
  area: z.number().default(1000),
  coverageRate: z.number().default(200),
  numCoats: z.number().default(2),
  wasteFactor: z.number().default(10),
  porosityFactor: z.number().default(1),
  pricePerUnit: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Concrete_sealer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coverageRate / input.porosityFactor; results["adjustedCoverage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedCoverage"] = 0; }
  try { const v = (input.area * input.numCoats * (1 + input.wasteFactor / 100) * input.porosityFactor) / input.coverageRate; results["totalSealer"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSealer"] = 0; }
  try { const v = (asFormulaNumber(results["totalSealer"])) * input.pricePerUnit; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateConcrete_sealer_calculator(input: Concrete_sealer_calculatorInput): Concrete_sealer_calculatorOutput {
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


export interface Concrete_sealer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
