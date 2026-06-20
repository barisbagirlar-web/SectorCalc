// Auto-generated from mole-calculator-schema.json
import * as z from 'zod';

export interface Mole_calculatorInput {
  mass: number;
  molarMass: number;
  avogadro: number;
  molarVolume: number;
  dataConfidence?: number;
}

export const Mole_calculatorInputSchema = z.object({
  mass: z.number().default(18.015),
  molarMass: z.number().default(18.015),
  avogadro: z.number().default(6.02214076e+23),
  molarVolume: z.number().default(22.414),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mole_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mass / input.molarMass; results["moles"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["moles"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["moles"])) * input.avogadro; results["particles"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["particles"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["moles"])) * input.molarVolume; results["volumeSTP"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeSTP"] = Number.NaN; }
  return results;
}


export function calculateMole_calculator(input: Mole_calculatorInput): Mole_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["moles"]);
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


export interface Mole_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
