// @ts-nocheck
// Auto-generated from rafter-length-calculator-schema.json
import * as z from 'zod';

export interface Rafter_length_calculatorInput {
  buildingWidth: number;
  ridgeThickness: number;
  overhang: number;
  roofPitch: number;
}

export const Rafter_length_calculatorInputSchema = z.object({
  buildingWidth: z.number().default(6000),
  ridgeThickness: z.number().default(38),
  overhang: z.number().default(300),
  roofPitch: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rafter_length_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.buildingWidth / 2 - input.ridgeThickness / 2; results["horizontalRun"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["horizontalRun"] = 0; }
  try { const v = (asFormulaNumber(results["horizontalRun"])) + input.overhang; results["totalRun"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalRun"] = 0; }
  try { const v = input.roofPitch; results["plumbCutAngle"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["plumbCutAngle"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRafter_length_calculator(input: Rafter_length_calculatorInput): Rafter_length_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["plumbCutAngle"]);
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


export interface Rafter_length_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
