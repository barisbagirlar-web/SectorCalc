// @ts-nocheck
// Auto-generated from rewards-calculator-schema.json
import * as z from 'zod';

export interface Rewards_calculatorInput {
  baseSalary: number;
  performanceScore: number;
  bonusPercent: number;
  teamMultiplier: number;
  tenureYears: number;
  safetyRating: number;
}

export const Rewards_calculatorInputSchema = z.object({
  baseSalary: z.number().default(5000),
  performanceScore: z.number().default(80),
  bonusPercent: z.number().default(20),
  teamMultiplier: z.number().default(1),
  tenureYears: z.number().default(2),
  safetyRating: z.number().default(95),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rewards_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.baseSalary + (asFormulaNumber(results["bonus"])) + (asFormulaNumber(results["loyalty"])) + (asFormulaNumber(results["safety"])); results["total"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total"] = 0; }
  try { const v = input.baseSalary * (input.bonusPercent / 100) * (input.performanceScore / 100) * input.teamMultiplier; results["bonus"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bonus"] = 0; }
  try { const v = input.baseSalary * 0.01 * input.tenureYears; results["loyalty"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["loyalty"] = 0; }
  try { const v = input.baseSalary * (input.safetyRating / 100) * 0.05; results["safety"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["safety"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRewards_calculator(input: Rewards_calculatorInput): Rewards_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total"]);
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


export interface Rewards_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
