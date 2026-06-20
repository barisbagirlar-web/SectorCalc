// Auto-generated from absorbed-dose-calculator-schema.json
import * as z from 'zod';

export interface Absorbed_dose_calculatorInput {
  mass: number;
  energy: number;
  time: number;
  density: number;
  volume: number;
  dataConfidence?: number;
}

export const Absorbed_dose_calculatorInputSchema = z.object({
  mass: z.number().default(1),
  energy: z.number().default(100),
  time: z.number().default(3600),
  density: z.number().default(1000),
  volume: z.number().default(0.001),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Absorbed_dose_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.energy / input.mass; results["absorbedDose"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["absorbedDose"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["absorbedDose"])) / input.time; results["doseRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["doseRate"] = Number.NaN; }
  try { const v = input.density * input.volume; results["massFromDensity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["massFromDensity"] = Number.NaN; }
  try { const v = ((input.mass === (toNumericFormulaValue(results["massFromDensity"])) ? input.mass : (input.mass + (toNumericFormulaValue(results["massFromDensity"]))) / 2) ? 1 : 0); results["checkMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["checkMass"] = Number.NaN; }
  return results;
}


export function calculateAbsorbed_dose_calculator(input: Absorbed_dose_calculatorInput): Absorbed_dose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["absorbedDose"]);
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


export interface Absorbed_dose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
