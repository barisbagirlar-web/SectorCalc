// Auto-generated from archery-calculator-schema.json
import * as z from 'zod';

export interface Archery_calculatorInput {
  bowIboSpeed: number;
  drawWeight: number;
  drawLength: number;
  arrowWeight: number;
  dataConfidence?: number;
}

export const Archery_calculatorInputSchema = z.object({
  bowIboSpeed: z.number().default(300),
  drawWeight: z.number().default(70),
  drawLength: z.number().default(30),
  arrowWeight: z.number().default(350),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Archery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bowIboSpeed + (input.drawWeight - 70) * 1.5 - (30 - input.drawLength) * 10 - (input.arrowWeight - 350) / 3; results["velocityFtPerSec"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["velocityFtPerSec"] = Number.NaN; }
  try { const v = (input.arrowWeight * (toNumericFormulaValue(results["velocityFtPerSec"])) ** 2) / 450240; results["kineticEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kineticEnergy"] = Number.NaN; }
  try { const v = input.arrowWeight * (toNumericFormulaValue(results["velocityFtPerSec"])) / 225400; results["momentum"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["momentum"] = Number.NaN; }
  return results;
}


export function calculateArchery_calculator(input: Archery_calculatorInput): Archery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["velocityFtPerSec"]);
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


export interface Archery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
