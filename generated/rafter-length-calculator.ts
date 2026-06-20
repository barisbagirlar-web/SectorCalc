// Auto-generated from rafter-length-calculator-schema.json
import * as z from 'zod';

export interface Rafter_length_calculatorInput {
  buildingWidth: number;
  ridgeThickness: number;
  overhang: number;
  roofPitch: number;
  dataConfidence?: number;
}

export const Rafter_length_calculatorInputSchema = z.object({
  buildingWidth: z.number().default(6000),
  ridgeThickness: z.number().default(38),
  overhang: z.number().default(300),
  roofPitch: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rafter_length_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.buildingWidth / 2 - input.ridgeThickness / 2; results["horizontalRun"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["horizontalRun"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["horizontalRun"])) + input.overhang; results["totalRun"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRun"] = Number.NaN; }
  try { const v = input.roofPitch; results["plumbCutAngle"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["plumbCutAngle"] = Number.NaN; }
  return results;
}


export function calculateRafter_length_calculator(input: Rafter_length_calculatorInput): Rafter_length_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["plumbCutAngle"]);
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


export interface Rafter_length_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
