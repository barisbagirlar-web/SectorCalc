// Auto-generated from pupillary-distance-calculator-schema.json
import * as z from 'zod';

export interface Pupillary_distance_calculatorInput {
  rightPd: number;
  leftPd: number;
  workingDistance: number;
  vertexDistance: number;
  centerRotationDistance: number;
  dataConfidence?: number;
}

export const Pupillary_distance_calculatorInputSchema = z.object({
  rightPd: z.number().default(30),
  leftPd: z.number().default(30),
  workingDistance: z.number().default(40),
  vertexDistance: z.number().default(12),
  centerRotationDistance: z.number().default(15),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pupillary_distance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rightPd + input.leftPd; results["totalFarPd"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFarPd"] = 0; }
  try { const v = input.workingDistance * 10; results["workingDistMm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["workingDistMm"] = 0; }
  try { const v = (asFormulaNumber(results["workingDistMm"])) + input.vertexDistance + input.centerRotationDistance; results["effectiveDistance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveDistance"] = 0; }
  try { const v = input.rightPd * (asFormulaNumber(results["workingDistMm"])) / (asFormulaNumber(results["effectiveDistance"])); results["rightNearPd"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rightNearPd"] = 0; }
  try { const v = input.leftPd * (asFormulaNumber(results["workingDistMm"])) / (asFormulaNumber(results["effectiveDistance"])); results["leftNearPd"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["leftNearPd"] = 0; }
  try { const v = (asFormulaNumber(results["rightNearPd"])) + (asFormulaNumber(results["leftNearPd"])); results["totalNearPd"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalNearPd"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePupillary_distance_calculator(input: Pupillary_distance_calculatorInput): Pupillary_distance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalNearPd"]));
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


export interface Pupillary_distance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
