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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Passing_sight_distance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialSpeed / 3.6; results["vInitial"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vInitial"] = 0; }
  try { const v = input.targetSpeed / 3.6; results["vTarget"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vTarget"] = 0; }
  try { const v = input.opposingSpeed / 3.6; results["vOpp"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vOpp"] = 0; }
  try { const v = ((asFormulaNumber(results["vTarget"])) - (asFormulaNumber(results["vInitial"]))) / input.acceleration; results["tAcc"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tAcc"] = 0; }
  try { const v = (asFormulaNumber(results["tAcc"])) + input.timeConstant; results["t2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["t2"] = 0; }
  try { const v = (asFormulaNumber(results["vInitial"])) * input.perceptionReactionTime; results["d1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["d1"] = 0; }
  try { const v = (asFormulaNumber(results["vInitial"])) * (asFormulaNumber(results["tAcc"])) + 0.5 * input.acceleration * (asFormulaNumber(results["tAcc"])) ** 2; results["dAcc"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dAcc"] = 0; }
  try { const v = (asFormulaNumber(results["vTarget"])) * input.timeConstant; results["dConst"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dConst"] = 0; }
  try { const v = (asFormulaNumber(results["dAcc"])) + (asFormulaNumber(results["dConst"])); results["d2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["d2"] = 0; }
  try { const v = input.clearanceDistance; results["d3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["d3"] = 0; }
  try { const v = (asFormulaNumber(results["vOpp"])) * (2/3) * (asFormulaNumber(results["t2"])); results["d4"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["d4"] = 0; }
  try { const v = (asFormulaNumber(results["d1"])) + (asFormulaNumber(results["d2"])) + (asFormulaNumber(results["d3"])) + (asFormulaNumber(results["d4"])); results["passingSightDistance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["passingSightDistance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePassing_sight_distance_calculator(input: Passing_sight_distance_calculatorInput): Passing_sight_distance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["passingSightDistance"]));
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


export interface Passing_sight_distance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
