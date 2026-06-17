// @ts-nocheck
// Auto-generated from basketball-shooting-percentage-calculator-schema.json
import * as z from 'zod';

export interface Basketball_shooting_percentage_calculatorInput {
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
}

export const Basketball_shooting_percentage_calculatorInputSchema = z.object({
  fieldGoalsMade: z.number().default(0),
  fieldGoalsAttempted: z.number().default(0),
  threePointersMade: z.number().default(0),
  threePointersAttempted: z.number().default(0),
  freeThrowsMade: z.number().default(0),
  freeThrowsAttempted: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Basketball_shooting_percentage_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.fieldGoalsAttempted > 0 ? (input.fieldGoalsMade / input.fieldGoalsAttempted) * 100 : 0; results["shootingPercentage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["shootingPercentage"] = 0; }
  try { const v = input.threePointersAttempted > 0 ? (input.threePointersMade / input.threePointersAttempted) * 100 : 0; results["threePointPercentage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["threePointPercentage"] = 0; }
  try { const v = input.freeThrowsAttempted > 0 ? (input.freeThrowsMade / input.freeThrowsAttempted) * 100 : 0; results["freeThrowPercentage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["freeThrowPercentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBasketball_shooting_percentage_calculator(input: Basketball_shooting_percentage_calculatorInput): Basketball_shooting_percentage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["shootingPercentage"]);
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


export interface Basketball_shooting_percentage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
