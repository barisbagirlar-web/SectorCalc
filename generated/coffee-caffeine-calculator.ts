// Auto-generated from coffee-caffeine-calculator-schema.json
import * as z from 'zod';

export interface Coffee_caffeine_calculatorInput {
  cupVolumeMl: number;
  caffeineMgPer100ml: number;
  numberOfCups: number;
  brewStrengthFactor: number;
  isDecaf: number;
  dataConfidence?: number;
}

export const Coffee_caffeine_calculatorInputSchema = z.object({
  cupVolumeMl: z.number().default(240),
  caffeineMgPer100ml: z.number().default(40),
  numberOfCups: z.number().default(1),
  brewStrengthFactor: z.number().default(1),
  isDecaf: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Coffee_caffeine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cupVolumeMl / 100) * input.caffeineMgPer100ml * input.brewStrengthFactor; results["caffeinePerCupMg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["caffeinePerCupMg"] = Number.NaN; }
  try { const v = (input.cupVolumeMl / 100) * input.caffeineMgPer100ml * input.brewStrengthFactor * input.numberOfCups; results["totalBeforeDecaf"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBeforeDecaf"] = Number.NaN; }
  try { const v = (input.cupVolumeMl / 100) * input.caffeineMgPer100ml * input.brewStrengthFactor * input.numberOfCups * (input.isDecaf * 0.97); results["decafReductionMg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["decafReductionMg"] = Number.NaN; }
  try { const v = (input.cupVolumeMl / 100) * input.caffeineMgPer100ml * input.brewStrengthFactor * input.numberOfCups * (1 - input.isDecaf * 0.97); results["totalCaffeineMg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCaffeineMg"] = Number.NaN; }
  return results;
}


export function calculateCoffee_caffeine_calculator(input: Coffee_caffeine_calculatorInput): Coffee_caffeine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCaffeineMg"]);
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


export interface Coffee_caffeine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
