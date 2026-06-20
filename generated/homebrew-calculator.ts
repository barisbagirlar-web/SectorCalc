// Auto-generated from homebrew-calculator-schema.json
import * as z from 'zod';

export interface Homebrew_calculatorInput {
  grainWeight: number;
  hopWeight: number;
  alphaAcid: number;
  boilVolume: number;
  boilTime: number;
  attenuation: number;
  efficiency: number;
  dataConfidence?: number;
}

export const Homebrew_calculatorInputSchema = z.object({
  grainWeight: z.number().default(5),
  hopWeight: z.number().default(50),
  alphaAcid: z.number().default(5),
  boilVolume: z.number().default(20),
  boilTime: z.number().default(60),
  attenuation: z.number().default(75),
  efficiency: z.number().default(75),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Homebrew_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 + (input.grainWeight * 300 * (input.efficiency / 100)) / (input.boilVolume * 1000); results["originalGravity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["originalGravity"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["originalGravity"])) - ((toNumericFormulaValue(results["originalGravity"])) - 1) * (input.attenuation / 100); results["finalGravity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalGravity"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["originalGravity"])) - (toNumericFormulaValue(results["finalGravity"]))) * 131.25; results["abv"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["abv"] = Number.NaN; }
  return results;
}


export function calculateHomebrew_calculator(input: Homebrew_calculatorInput): Homebrew_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["abv"]);
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


export interface Homebrew_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
