// @ts-nocheck
// Auto-generated from roofing-calculator-schema.json
import * as z from 'zod';

export interface Roofing_calculatorInput {
  roofLength: number;
  roofWidth: number;
  roofPitch: number;
  materialCostPerSqm: number;
  laborCostPerSqm: number;
  wasteFactor: number;
}

export const Roofing_calculatorInputSchema = z.object({
  roofLength: z.number().default(10),
  roofWidth: z.number().default(8),
  roofPitch: z.number().default(30),
  materialCostPerSqm: z.number().default(50),
  laborCostPerSqm: z.number().default(30),
  wasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Roofing_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.roofLength * input.roofWidth; results["flatArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["flatArea"] = 0; }
  try { const v = input.roofPitch * Math.PI / 180; results["pitchRad"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pitchRad"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRoofing_calculator(input: Roofing_calculatorInput): Roofing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pitchRad"]);
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


export interface Roofing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
