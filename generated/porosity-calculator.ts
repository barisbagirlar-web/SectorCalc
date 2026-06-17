// @ts-nocheck
// Auto-generated from porosity-calculator-schema.json
import * as z from 'zod';

export interface Porosity_calculatorInput {
  bulkDensity: number;
  particleDensity: number;
  totalVolume: number;
  poreVolume: number;
}

export const Porosity_calculatorInputSchema = z.object({
  bulkDensity: z.number().default(2.5),
  particleDensity: z.number().default(2.65),
  totalVolume: z.number().default(100),
  poreVolume: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Porosity_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.particleDensity - input.bulkDensity) / input.particleDensity; results["porosityFraction"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["porosityFraction"] = 0; }
  try { const v = (asFormulaNumber(results["porosityFraction"])) * 100; results["porosityPercentage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["porosityPercentage"] = 0; }
  try { const v = input.poreVolume / input.totalVolume; results["volumetricPorosityFraction"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["volumetricPorosityFraction"] = 0; }
  try { const v = (asFormulaNumber(results["volumetricPorosityFraction"])) * 100; results["volumetricPorosityPercentage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["volumetricPorosityPercentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePorosity_calculator(input: Porosity_calculatorInput): Porosity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["porosityPercentage"]);
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


export interface Porosity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
