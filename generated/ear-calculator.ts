// Auto-generated from ear-calculator-schema.json
import * as z from 'zod';

export interface Ear_calculatorInput {
  nominalRate: number;
  compoundingPeriods: number;
  years: number;
  principal: number;
  dataConfidence?: number;
}

export const Ear_calculatorInputSchema = z.object({
  nominalRate: z.number().default(5),
  compoundingPeriods: z.number().default(12),
  years: z.number().default(1),
  principal: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ear_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nominalRate / 100 / input.compoundingPeriods; results["periodicRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["periodicRate"] = 0; }
  try { const v = ((1 + (asFormulaNumber(results["periodicRate"]))) ** input.compoundingPeriods - 1) * 100; results["effectiveAnnualRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualRate"] = 0; }
  try { const v = ((1 + (asFormulaNumber(results["periodicRate"]))) ** (input.compoundingPeriods * input.years)); results["growthFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["growthFactor"] = 0; }
  try { const v = input.principal * (asFormulaNumber(results["growthFactor"])); results["futureValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["futureValue"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEar_calculator(input: Ear_calculatorInput): Ear_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effectiveAnnualRate"]);
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


export interface Ear_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
