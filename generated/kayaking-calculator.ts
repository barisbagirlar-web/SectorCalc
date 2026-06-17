// @ts-nocheck
// Auto-generated from kayaking-calculator-schema.json
import * as z from 'zod';

export interface Kayaking_calculatorInput {
  speed: number;
  dragCoefficient: number;
  crossSectionalArea: number;
  waterDensity: number;
  paddlingEfficiency: number;
}

export const Kayaking_calculatorInputSchema = z.object({
  speed: z.number().default(2.5),
  dragCoefficient: z.number().default(0.5),
  crossSectionalArea: z.number().default(0.3),
  waterDensity: z.number().default(1000),
  paddlingEfficiency: z.number().default(70),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kayaking_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 0.5 * input.waterDensity * input.dragCoefficient * input.crossSectionalArea * input.speed * input.speed; results["dragForce"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dragForce"] = 0; }
  try { const v = (asFormulaNumber(results["dragForce"])) * input.speed; results["effectivePower"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectivePower"] = 0; }
  try { const v = (asFormulaNumber(results["effectivePower"])) / (input.paddlingEfficiency / 100); results["powerRequired"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["powerRequired"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateKayaking_calculator(input: Kayaking_calculatorInput): Kayaking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["powerRequired"]);
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


export interface Kayaking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
