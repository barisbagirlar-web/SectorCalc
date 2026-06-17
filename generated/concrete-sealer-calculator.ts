// @ts-nocheck
// Auto-generated from concrete-sealer-calculator-schema.json
import * as z from 'zod';

export interface Concrete_sealer_calculatorInput {
  area: number;
  coverageRate: number;
  numCoats: number;
  wasteFactor: number;
  porosityFactor: number;
  pricePerUnit: number;
}

export const Concrete_sealer_calculatorInputSchema = z.object({
  area: z.number().default(1000),
  coverageRate: z.number().default(200),
  numCoats: z.number().default(2),
  wasteFactor: z.number().default(10),
  porosityFactor: z.number().default(1),
  pricePerUnit: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Concrete_sealer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.coverageRate / input.porosityFactor; results["adjustedCoverage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedCoverage"] = 0; }
  try { const v = (input.area * input.numCoats * (1 + input.wasteFactor / 100) * input.porosityFactor) / input.coverageRate; results["totalSealer"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalSealer"] = 0; }
  try { const v = (asFormulaNumber(results["totalSealer"])) * input.pricePerUnit; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateConcrete_sealer_calculator(input: Concrete_sealer_calculatorInput): Concrete_sealer_calculatorOutput {
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


export interface Concrete_sealer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
