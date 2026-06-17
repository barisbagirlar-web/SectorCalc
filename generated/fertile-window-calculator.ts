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

function evaluateAllFormulas(input: Fertile_window_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cycleLength - input.lutealPhaseLength; results["ovulationDay"] = Number.isFinite(v) ? v : 0; } catch { results["ovulationDay"] = 0; }
  try { const v = (results["ovulationDay"] ?? 0) - input.spermLifeSpan; results["fertileStart"] = Number.isFinite(v) ? v : 0; } catch { results["fertileStart"] = 0; }
  try { const v = (results["ovulationDay"] ?? 0) + input.eggLifeSpan; results["fertileEnd"] = Number.isFinite(v) ? v : 0; } catch { results["fertileEnd"] = 0; }
  try { const v = $(results["ovulationDay"] ?? 0); results["__ovulationDay_"] = Number.isFinite(v) ? v : 0; } catch { results["__ovulationDay_"] = 0; }
  results["__fertileStart___based_on_sperm_lifespan"] = 0;
  results["__fertileEnd___based_on_egg_lifespan_of_"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateFertile_window_calculator(input: Fertile_window_calculatorInput): Fertile_window_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
