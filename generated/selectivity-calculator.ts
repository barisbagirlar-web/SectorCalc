// Auto-generated from selectivity-calculator-schema.json
import * as z from 'zod';

export interface Selectivity_calculatorInput {
  massReactantFed: number;
  molarMassReactant: number;
  conversion: number;
  massDesired: number;
  molarMassDesired: number;
  massUndesired: number;
  molarMassUndesired: number;
  dataConfidence?: number;
}

export const Selectivity_calculatorInputSchema = z.object({
  massReactantFed: z.number().default(100),
  molarMassReactant: z.number().default(50),
  conversion: z.number().default(0.5),
  massDesired: z.number().default(40),
  molarMassDesired: z.number().default(80),
  massUndesired: z.number().default(20),
  molarMassUndesired: z.number().default(60),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Selectivity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massReactantFed / input.molarMassReactant; results["molesReactantFed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["molesReactantFed"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["molesReactantFed"])) * input.conversion; results["molesReactantConsumed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["molesReactantConsumed"] = Number.NaN; }
  try { const v = input.massDesired / input.molarMassDesired; results["molesDesired"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["molesDesired"] = Number.NaN; }
  try { const v = input.massUndesired / input.molarMassUndesired; results["molesUndesired"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["molesUndesired"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["molesDesired"])) / (toNumericFormulaValue(results["molesUndesired"])); results["selectivity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["selectivity"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["molesDesired"])) / (toNumericFormulaValue(results["molesReactantFed"])); results["yield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yield"] = Number.NaN; }
  return results;
}


export function calculateSelectivity_calculator(input: Selectivity_calculatorInput): Selectivity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["selectivity"]);
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


export interface Selectivity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
