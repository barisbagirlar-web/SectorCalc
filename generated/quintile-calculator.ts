// Auto-generated from quintile-calculator-schema.json
import * as z from 'zod';

export interface Quintile_calculatorInput {
  min: number;
  p20: number;
  p40: number;
  p60: number;
  p80: number;
  max: number;
  value: number;
  dataConfidence?: number;
}

export const Quintile_calculatorInputSchema = z.object({
  min: z.number().default(0),
  p20: z.number().default(20),
  p40: z.number().default(40),
  p60: z.number().default(60),
  p80: z.number().default(80),
  max: z.number().default(100),
  value: z.number().default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Quintile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.value <= input.p20 ? 1 : input.value <= input.p40 ? 2 : input.value <= input.p60 ? 3 : input.value <= input.p80 ? 4 : 5; results["q"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["q"] = 0; }
  try { const v = (asFormulaNumber(results["q"])) === 1 ? (input.value - input.min) / (input.p20 - input.min) : (asFormulaNumber(results["q"])) === 2 ? (input.value - input.p20) / (input.p40 - input.p20) : (asFormulaNumber(results["q"])) === 3 ? (input.value - input.p40) / (input.p60 - input.p40) : (asFormulaNumber(results["q"])) === 4 ? (input.value - input.p60) / (input.p80 - input.p60) : (input.value - input.p80) / (input.max - input.p80); results["within"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["within"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateQuintile_calculator(input: Quintile_calculatorInput): Quintile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["within"]);
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


export interface Quintile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
