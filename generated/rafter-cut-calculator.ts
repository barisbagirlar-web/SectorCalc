// Auto-generated from rafter-cut-calculator-schema.json
import * as z from 'zod';

export interface Rafter_cut_calculatorInput {
  roofPitch: number;
  buildingWidth: number;
  overhang: number;
  rafterDepth: number;
  dataConfidence?: number;
}

export const Rafter_cut_calculatorInputSchema = z.object({
  roofPitch: z.number().default(30),
  buildingWidth: z.number().default(6000),
  overhang: z.number().default(500),
  rafterDepth: z.number().default(150),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rafter_cut_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.buildingWidth / 2 + input.overhang; results["totalRun"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRun"] = 0; }
  try { const v = input.rafterDepth / 3; results["seatCutDepth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["seatCutDepth"] = 0; }
  try { const v = input.rafterDepth * 2 / 3; results["heelHeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["heelHeight"] = 0; }
  try { const v = input.roofPitch; results["plumbCutAngle"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["plumbCutAngle"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRafter_cut_calculator(input: Rafter_cut_calculatorInput): Rafter_cut_calculatorOutput {
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


export interface Rafter_cut_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
