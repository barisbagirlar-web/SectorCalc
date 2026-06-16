// Auto-generated from percent-composition-calculator-schema.json
import * as z from 'zod';

export interface Percent_composition_calculatorInput {
  mass1: number;
  mass2: number;
  mass3: number;
  mass4: number;
  mass5: number;
}

export const Percent_composition_calculatorInputSchema = z.object({
  mass1: z.number().default(0),
  mass2: z.number().default(0),
  mass3: z.number().default(0),
  mass4: z.number().default(0),
  mass5: z.number().default(0),
});

function evaluateAllFormulas(input: Percent_composition_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.mass1+input.mass2+input.mass3+input.mass4+input.mass5) === 0 ? 0 : (input.mass1 / (input.mass1+input.mass2+input.mass3+input.mass4+input.mass5)) * 100; results["pct1"] = Number.isFinite(v) ? v : 0; } catch { results["pct1"] = 0; }
  try { const v = (input.mass1+input.mass2+input.mass3+input.mass4+input.mass5) === 0 ? 0 : (input.mass2 / (input.mass1+input.mass2+input.mass3+input.mass4+input.mass5)) * 100; results["pct2"] = Number.isFinite(v) ? v : 0; } catch { results["pct2"] = 0; }
  try { const v = (input.mass1+input.mass2+input.mass3+input.mass4+input.mass5) === 0 ? 0 : (input.mass3 / (input.mass1+input.mass2+input.mass3+input.mass4+input.mass5)) * 100; results["pct3"] = Number.isFinite(v) ? v : 0; } catch { results["pct3"] = 0; }
  try { const v = (input.mass1+input.mass2+input.mass3+input.mass4+input.mass5) === 0 ? 0 : (input.mass4 / (input.mass1+input.mass2+input.mass3+input.mass4+input.mass5)) * 100; results["pct4"] = Number.isFinite(v) ? v : 0; } catch { results["pct4"] = 0; }
  try { const v = (input.mass1+input.mass2+input.mass3+input.mass4+input.mass5) === 0 ? 0 : (input.mass5 / (input.mass1+input.mass2+input.mass3+input.mass4+input.mass5)) * 100; results["pct5"] = Number.isFinite(v) ? v : 0; } catch { results["pct5"] = 0; }
  results["all"] = 0;
  return results;
}


export function calculatePercent_composition_calculator(input: Percent_composition_calculatorInput): Percent_composition_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["all"] ?? 0;
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


export interface Percent_composition_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
