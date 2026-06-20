// Auto-generated from passing-sight-distance-calculator-schema.json
import * as z from 'zod';

export interface Passing_sight_distance_calculatorInput {
  initialSpeed: number;
  targetSpeed: number;
  acceleration: number;
  timeConstant: number;
  perceptionReactionTime: number;
  clearanceDistance: number;
  opposingSpeed: number;
  dataConfidence?: number;
}

export const Passing_sight_distance_calculatorInputSchema = z.object({
  initialSpeed: z.number().default(80),
  targetSpeed: z.number().default(100),
  acceleration: z.number().default(1.5),
  timeConstant: z.number().default(3),
  perceptionReactionTime: z.number().default(1.5),
  clearanceDistance: z.number().default(30),
  opposingSpeed: z.number().default(80),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Passing_sight_distance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialSpeed / 3.6; results["vInitial"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vInitial"] = Number.NaN; }
  try { const v = input.targetSpeed / 3.6; results["vTarget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vTarget"] = Number.NaN; }
  try { const v = input.opposingSpeed / 3.6; results["vOpp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vOpp"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["vTarget"])) - (toNumericFormulaValue(results["vInitial"]))) / input.acceleration; results["tAcc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tAcc"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["tAcc"])) + input.timeConstant; results["t2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["t2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["vInitial"])) * input.perceptionReactionTime; results["d1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["d1"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["vInitial"])) * (toNumericFormulaValue(results["tAcc"])) + 0.5 * input.acceleration * (toNumericFormulaValue(results["tAcc"])) ** 2; results["dAcc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dAcc"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["vTarget"])) * input.timeConstant; results["dConst"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dConst"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dAcc"])) + (toNumericFormulaValue(results["dConst"])); results["d2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["d2"] = Number.NaN; }
  try { const v = input.clearanceDistance; results["d3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["d3"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["vOpp"])) * (2/3) * (toNumericFormulaValue(results["t2"])); results["d4"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["d4"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["d1"])) + (toNumericFormulaValue(results["d2"])) + (toNumericFormulaValue(results["d3"])) + (toNumericFormulaValue(results["d4"])); results["passingSightDistance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["passingSightDistance"] = Number.NaN; }
  return results;
}


export function calculatePassing_sight_distance_calculator(input: Passing_sight_distance_calculatorInput): Passing_sight_distance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["passingSightDistance"]);
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


export interface Passing_sight_distance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
