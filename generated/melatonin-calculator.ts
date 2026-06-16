// Auto-generated from melatonin-calculator-schema.json
import * as z from 'zod';

export interface Melatonin_calculatorInput {
  age: number;
  weight: number;
  nightShift: number;
  jetLagFactor: number;
}

export const Melatonin_calculatorInputSchema = z.object({
  age: z.number().default(30),
  weight: z.number().default(70),
  nightShift: z.number().default(0),
  jetLagFactor: z.number().default(0),
});

function evaluateAllFormulas(input: Melatonin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age >= 60 ? 1 : 0.5; results["baseDose"] = Number.isFinite(v) ? v : 0; } catch { results["baseDose"] = 0; }
  try { const v = input.weight > 90 ? 1.2 : 1; results["weightMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["weightMultiplier"] = 0; }
  try { const v = input.nightShift == 1 ? 1.5 : 1; results["shiftMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["shiftMultiplier"] = 0; }
  try { const v = input.jetLagFactor * 0.5; results["jetLagAddition"] = Number.isFinite(v) ? v : 0; } catch { results["jetLagAddition"] = 0; }
  try { const v = ((results["baseDose"] ?? 0) * (results["weightMultiplier"] ?? 0) * (results["shiftMultiplier"] ?? 0)) + (results["jetLagAddition"] ?? 0); results["doseUncapped"] = Number.isFinite(v) ? v : 0; } catch { results["doseUncapped"] = 0; }
  try { const v = Math.min(5, (results["doseUncapped"] ?? 0)); results["dose"] = Number.isFinite(v) ? v : 0; } catch { results["dose"] = 0; }
  try { const v = Math.round((results["dose"] ?? 0) * 100) / 100; results["doseRounded"] = Number.isFinite(v) ? v : 0; } catch { results["doseRounded"] = 0; }
  return results;
}


export function calculateMelatonin_calculator(input: Melatonin_calculatorInput): Melatonin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["doseRounded"] ?? 0;
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


export interface Melatonin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
