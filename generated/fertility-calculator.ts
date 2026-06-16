// Auto-generated from fertility-calculator-schema.json
import * as z from 'zod';

export interface Fertility_calculatorInput {
  age: number;
  cycleLength: number;
  lutealPhase: number;
  monthsTrying: number;
}

export const Fertility_calculatorInputSchema = z.object({
  age: z.number().default(30),
  cycleLength: z.number().default(28),
  lutealPhase: z.number().default(14),
  monthsTrying: z.number().default(12),
});

function evaluateAllFormulas(input: Fertility_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cycleLength - input.lutealPhase; results["ovulationDay"] = Number.isFinite(v) ? v : 0; } catch { results["ovulationDay"] = 0; }
  try { const v = (results["ovulationDay"] ?? 0) - 5; results["fertileStartDay"] = Number.isFinite(v) ? v : 0; } catch { results["fertileStartDay"] = 0; }
  try { const v = (results["ovulationDay"] ?? 0) + 1; results["fertileEndDay"] = Number.isFinite(v) ? v : 0; } catch { results["fertileEndDay"] = 0; }
  try { const v = input.age <= 30 ? 1 : Math.max(0.1, 1 - (input.age - 30) * 0.02); results["ageFactor"] = Number.isFinite(v) ? v : 0; } catch { results["ageFactor"] = 0; }
  try { const v = (input.cycleLength >= 26 && input.cycleLength <= 32) ? 1 : 0.8; results["cycleFactor"] = Number.isFinite(v) ? v : 0; } catch { results["cycleFactor"] = 0; }
  try { const v = baseProb * (results["ageFactor"] ?? 0) * (results["cycleFactor"] ?? 0); results["probabilityPerCycle"] = Number.isFinite(v) ? v : 0; } catch { results["probabilityPerCycle"] = 0; }
  try { const v = 1 - Math.pow(1 - (results["probabilityPerCycle"] ?? 0), input.monthsTrying); results["cumulativeProbability"] = Number.isFinite(v) ? v : 0; } catch { results["cumulativeProbability"] = 0; }
  return results;
}


export function calculateFertility_calculator(input: Fertility_calculatorInput): Fertility_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["probabilityPerCycle"] ?? 0;
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


export interface Fertility_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
