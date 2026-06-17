// @ts-nocheck
// Auto-generated from fertile-window-calculator-schema.json
import * as z from 'zod';

export interface Fertile_window_calculatorInput {
  cycleLength: number;
  lutealPhaseLength: number;
  spermLifeSpan: number;
  eggLifeSpan: number;
  periodLength: number;
}

export const Fertile_window_calculatorInputSchema = z.object({
  cycleLength: z.number().default(28),
  lutealPhaseLength: z.number().default(14),
  spermLifeSpan: z.number().default(5),
  eggLifeSpan: z.number().default(1),
  periodLength: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fertile_window_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.cycleLength - input.lutealPhaseLength; results["ovulationDay"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ovulationDay"] = 0; }
  try { const v = (asFormulaNumber(results["ovulationDay"])) - input.spermLifeSpan; results["fertileStart"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fertileStart"] = 0; }
  try { const v = (asFormulaNumber(results["ovulationDay"])) + input.eggLifeSpan; results["fertileEnd"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fertileEnd"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFertile_window_calculator(input: Fertile_window_calculatorInput): Fertile_window_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["fertileEnd"]);
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


export interface Fertile_window_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
