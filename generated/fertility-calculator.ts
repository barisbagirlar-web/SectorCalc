// Auto-generated from fertility-calculator-schema.json
import * as z from 'zod';

export interface Fertility_calculatorInput {
  age: number;
  cycleLength: number;
  lutealPhase: number;
  monthsTrying: number;
  dataConfidence?: number;
}

export const Fertility_calculatorInputSchema = z.object({
  age: z.number().default(30),
  cycleLength: z.number().default(28),
  lutealPhase: z.number().default(14),
  monthsTrying: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fertility_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cycleLength - input.lutealPhase; results["ovulationDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ovulationDay"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ovulationDay"])) - 5; results["fertileStartDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fertileStartDay"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ovulationDay"])) + 1; results["fertileEndDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fertileEndDay"] = Number.NaN; }
  try { const v = (input.cycleLength >= 26 && input.cycleLength <= 32) ? 1 : 0.8; results["cycleFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cycleFactor"] = Number.NaN; }
  return results;
}


export function calculateFertility_calculator(input: Fertility_calculatorInput): Fertility_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cycleFactor"]);
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


export interface Fertility_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
