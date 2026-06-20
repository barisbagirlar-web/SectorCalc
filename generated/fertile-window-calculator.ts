// Auto-generated from fertile-window-calculator-schema.json
import * as z from 'zod';

export interface Fertile_window_calculatorInput {
  cycleLength: number;
  lutealPhaseLength: number;
  spermLifeSpan: number;
  eggLifeSpan: number;
  periodLength: number;
  dataConfidence?: number;
}

export const Fertile_window_calculatorInputSchema = z.object({
  cycleLength: z.number().default(28),
  lutealPhaseLength: z.number().default(14),
  spermLifeSpan: z.number().default(5),
  eggLifeSpan: z.number().default(1),
  periodLength: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fertile_window_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cycleLength - input.lutealPhaseLength; results["ovulationDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ovulationDay"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ovulationDay"])) - input.spermLifeSpan; results["fertileStart"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fertileStart"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ovulationDay"])) + input.eggLifeSpan; results["fertileEnd"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fertileEnd"] = Number.NaN; }
  return results;
}


export function calculateFertile_window_calculator(input: Fertile_window_calculatorInput): Fertile_window_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["fertileEnd"]);
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


export interface Fertile_window_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
