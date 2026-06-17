// @ts-nocheck
// Auto-generated from forklift-calculator-schema.json
import * as z from 'zod';

export interface Forklift_calculatorInput {
  ratedCapacity: number;
  standardLoadCenter: number;
  actualLoadCenter: number;
  liftHeight: number;
  maxLiftHeight: number;
  safetyFactor: number;
}

export const Forklift_calculatorInputSchema = z.object({
  ratedCapacity: z.number().default(5000),
  standardLoadCenter: z.number().default(600),
  actualLoadCenter: z.number().default(700),
  liftHeight: z.number().default(4),
  maxLiftHeight: z.number().default(5),
  safetyFactor: z.number().default(1.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Forklift_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.standardLoadCenter / input.actualLoadCenter; results["loadCenterDeratingFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["loadCenterDeratingFactor"] = 0; }
  try { const v = input.ratedCapacity * (input.standardLoadCenter / input.actualLoadCenter); results["capacityAtLoadCenter"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["capacityAtLoadCenter"] = 0; }
  try { const v = (input.ratedCapacity * (input.standardLoadCenter / input.actualLoadCenter)) * ((input.liftHeight > 0.8 * input.maxLiftHeight) ? (1 - ((input.liftHeight - 0.8 * input.maxLiftHeight) / (0.2 * input.maxLiftHeight)) * 0.3) : 1); results["capacityAtLiftHeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["capacityAtLiftHeight"] = 0; }
  try { const v = ((input.ratedCapacity * (input.standardLoadCenter / input.actualLoadCenter)) * ((input.liftHeight > 0.8 * input.maxLiftHeight) ? (1 - ((input.liftHeight - 0.8 * input.maxLiftHeight) / (0.2 * input.maxLiftHeight)) * 0.3) : 1)) / input.safetyFactor; results["finalSafeLoad"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["finalSafeLoad"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateForklift_calculator(input: Forklift_calculatorInput): Forklift_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalSafeLoad"]);
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


export interface Forklift_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
