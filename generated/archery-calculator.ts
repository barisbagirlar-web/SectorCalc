// @ts-nocheck
// Auto-generated from archery-calculator-schema.json
import * as z from 'zod';

export interface Archery_calculatorInput {
  bowIboSpeed: number;
  drawWeight: number;
  drawLength: number;
  arrowWeight: number;
}

export const Archery_calculatorInputSchema = z.object({
  bowIboSpeed: z.number().default(300),
  drawWeight: z.number().default(70),
  drawLength: z.number().default(30),
  arrowWeight: z.number().default(350),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Archery_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.bowIboSpeed + (input.drawWeight - 70) * 1.5 - (30 - input.drawLength) * 10 - (input.arrowWeight - 350) / 3; results["velocityFtPerSec"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["velocityFtPerSec"] = 0; }
  try { const v = (input.arrowWeight * (asFormulaNumber(results["velocityFtPerSec"])) ** 2) / 450240; results["kineticEnergy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["kineticEnergy"] = 0; }
  try { const v = input.arrowWeight * (asFormulaNumber(results["velocityFtPerSec"])) / 225400; results["momentum"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["momentum"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateArchery_calculator(input: Archery_calculatorInput): Archery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["velocityFtPerSec"]);
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


export interface Archery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
