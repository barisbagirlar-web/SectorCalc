// Auto-generated from yo-yo-diet-calculator-schema.json
import * as z from 'zod';

export interface Yo_yo_diet_calculatorInput {
  initialWeight: number;
  currentWeight: number;
  numberOfCycles: number;
  weightLossPerCycle: number;
  weightRegainPerCycle: number;
  cycleDurationDays: number;
  dataConfidence?: number;
}

export const Yo_yo_diet_calculatorInputSchema = z.object({
  initialWeight: z.number().default(80),
  currentWeight: z.number().default(82),
  numberOfCycles: z.number().default(3),
  weightLossPerCycle: z.number().default(5),
  weightRegainPerCycle: z.number().default(4),
  cycleDurationDays: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Yo_yo_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentWeight - input.initialWeight; results["netWeightChange"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netWeightChange"] = 0; }
  try { const v = input.numberOfCycles * input.weightLossPerCycle; results["totalWeightLost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeightLost"] = 0; }
  try { const v = input.numberOfCycles * input.weightRegainPerCycle; results["totalWeightRegained"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeightRegained"] = 0; }
  try { const v = (((asFormulaNumber(results["totalWeightLost"])) !== 0 ? (asFormulaNumber(results["totalWeightRegained"])) / (asFormulaNumber(results["totalWeightLost"])) : 0) ? 1 : 0); results["yoyoIndex"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yoyoIndex"] = 0; }
  try { const v = (input.weightLossPerCycle + input.weightRegainPerCycle) / 2; results["averageCycleFluctuation"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averageCycleFluctuation"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateYo_yo_diet_calculator(input: Yo_yo_diet_calculatorInput): Yo_yo_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["yoyoIndex"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Yo_yo_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
