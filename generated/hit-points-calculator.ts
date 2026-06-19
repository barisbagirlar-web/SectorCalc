// Auto-generated from hit-points-calculator-schema.json
import * as z from 'zod';

export interface Hit_points_calculatorInput {
  initialHP: number;
  damagePerCycle: number;
  cycles: number;
  safetyFactor: number;
  repairHP: number;
  dataConfidence?: number;
}

export const Hit_points_calculatorInputSchema = z.object({
  initialHP: z.number().default(100),
  damagePerCycle: z.number().default(1),
  cycles: z.number().default(10),
  safetyFactor: z.number().default(1.5),
  repairHP: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hit_points_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.damagePerCycle * input.cycles; results["baseDamage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseDamage"] = 0; }
  try { const v = input.damagePerCycle * input.cycles * input.safetyFactor; results["safetyAdjustedDamage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["safetyAdjustedDamage"] = 0; }
  try { const v = input.initialHP + input.repairHP - (input.damagePerCycle * input.cycles * input.safetyFactor); results["netHP"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netHP"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHit_points_calculator(input: Hit_points_calculatorInput): Hit_points_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["netHP"]));
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


export interface Hit_points_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
