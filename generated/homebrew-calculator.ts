// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Homebrew_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 1 + (input.grainWeight * 300 * (input.efficiency / 100)) / (input.boilVolume * 1000); results["originalGravity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["originalGravity"] = 0; }
  try { const v = (asFormulaNumber(results["originalGravity"])) - ((asFormulaNumber(results["originalGravity"])) - 1) * (input.attenuation / 100); results["finalGravity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["finalGravity"] = 0; }
  try { const v = ((asFormulaNumber(results["originalGravity"])) - (asFormulaNumber(results["finalGravity"]))) * 131.25; results["abv"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["abv"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHomebrew_calculator(input: Homebrew_calculatorInput): Homebrew_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["abv"]);
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


export interface Homebrew_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
