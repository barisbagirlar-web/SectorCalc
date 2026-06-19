// Auto-generated from concrete-yield-calculator-schema.json
import * as z from 'zod';

export interface Concrete_yield_calculatorInput {
  cementMass: number;
  waterMass: number;
  fineAggregateMass: number;
  coarseAggregateMass: number;
  admixtureMass: number;
  freshDensity: number;
  bagMass: number;
  dataConfidence?: number;
}

export const Concrete_yield_calculatorInputSchema = z.object({
  cementMass: z.number().default(350),
  waterMass: z.number().default(175),
  fineAggregateMass: z.number().default(800),
  coarseAggregateMass: z.number().default(1050),
  admixtureMass: z.number().default(0),
  freshDensity: z.number().default(2400),
  bagMass: z.number().default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Concrete_yield_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cementMass + input.waterMass + input.fineAggregateMass + input.coarseAggregateMass + input.admixtureMass; results["totalMass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMass"] = 0; }
  try { const v = (asFormulaNumber(results["totalMass"])) / input.freshDensity; results["yieldVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yieldVolume"] = 0; }
  try { const v = (asFormulaNumber(results["yieldVolume"])) / (input.cementMass / input.bagMass); results["yieldPerBag"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yieldPerBag"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateConcrete_yield_calculator(input: Concrete_yield_calculatorInput): Concrete_yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["yieldVolume"]);
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


export interface Concrete_yield_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
