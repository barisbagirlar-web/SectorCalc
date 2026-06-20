// Auto-generated from gear-calculator-schema.json
import * as z from 'zod';

export interface Gear_calculatorInput {
  module: number;
  z1: number;
  z2: number;
  pressureAngle: number;
  ha: number;
  hf: number;
  dataConfidence?: number;
}

export const Gear_calculatorInputSchema = z.object({
  module: z.number().default(2),
  z1: z.number().default(20),
  z2: z.number().default(40),
  pressureAngle: z.number().default(20),
  ha: z.number().default(1),
  hf: z.number().default(1.25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gear_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.module * input.z1; results["pitchDiameter1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pitchDiameter1"] = Number.NaN; }
  try { const v = input.module * input.z2; results["pitchDiameter2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pitchDiameter2"] = Number.NaN; }
  try { const v = input.z2 / input.z1; results["gearRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gearRatio"] = Number.NaN; }
  try { const v = (input.module * input.z1 + input.module * input.z2) / 2; results["centerDistance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["centerDistance"] = Number.NaN; }
  try { const v = input.ha * input.module; results["addendum"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["addendum"] = Number.NaN; }
  try { const v = input.hf * input.module; results["dedendum"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dedendum"] = Number.NaN; }
  return results;
}


export function calculateGear_calculator(input: Gear_calculatorInput): Gear_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["gearRatio"]);
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


export interface Gear_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
