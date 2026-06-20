// Auto-generated from brooke-formula-calculator-schema.json
import * as z from 'zod';

export interface Brooke_formula_calculatorInput {
  weight: number;
  tbsa: number;
  fluidFactor: number;
  firstPeriodHours: number;
  secondPeriodHours: number;
  dataConfidence?: number;
}

export const Brooke_formula_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  tbsa: z.number().default(20),
  fluidFactor: z.number().default(2),
  firstPeriodHours: z.number().default(8),
  secondPeriodHours: z.number().default(16),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Brooke_formula_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fluidFactor * input.weight * input.tbsa; results["totalFluid"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFluid"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalFluid"])) / 2; results["firstHalf"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["firstHalf"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalFluid"])) / 2; results["secondHalf"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["secondHalf"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["firstHalf"])) / input.firstPeriodHours; results["firstHourlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["firstHourlyRate"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["secondHalf"])) / input.secondPeriodHours; results["secondHourlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["secondHourlyRate"] = Number.NaN; }
  return results;
}


export function calculateBrooke_formula_calculator(input: Brooke_formula_calculatorInput): Brooke_formula_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalFluid"]);
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


export interface Brooke_formula_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
