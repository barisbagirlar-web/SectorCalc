// Auto-generated from lintel-calculator-schema.json
import * as z from 'zod';

export interface Lintel_calculatorInput {
  span: number;
  designLoad: number;
  allowableStress: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Lintel_calculatorInputSchema = z.object({
  span: z.number().default(2000),
  designLoad: z.number().default(10),
  allowableStress: z.number().default(165),
  safetyFactor: z.number().default(1.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lintel_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.designLoad * input.span ** 2 / 8; results["bendingMoment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bendingMoment"] = 0; }
  try { const v = (asFormulaNumber(results["bendingMoment"])) / (input.allowableStress * input.safetyFactor); results["requiredModulus"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredModulus"] = 0; }
  try { const v = (asFormulaNumber(results["requiredModulus"])) / 1000; results["requiredModulusCm3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredModulusCm3"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLintel_calculator(input: Lintel_calculatorInput): Lintel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["requiredModulusCm3"]));
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


export interface Lintel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
