// Auto-generated from porosity-calculator-schema.json
import * as z from 'zod';

export interface Porosity_calculatorInput {
  bulkDensity: number;
  particleDensity: number;
  totalVolume: number;
  poreVolume: number;
  dataConfidence?: number;
}

export const Porosity_calculatorInputSchema = z.object({
  bulkDensity: z.number().default(2.5),
  particleDensity: z.number().default(2.65),
  totalVolume: z.number().default(100),
  poreVolume: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Porosity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.particleDensity - input.bulkDensity) / input.particleDensity; results["porosityFraction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["porosityFraction"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["porosityFraction"])) * 100; results["porosityPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["porosityPercentage"] = Number.NaN; }
  try { const v = input.poreVolume / input.totalVolume; results["volumetricPorosityFraction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumetricPorosityFraction"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["volumetricPorosityFraction"])) * 100; results["volumetricPorosityPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumetricPorosityPercentage"] = Number.NaN; }
  return results;
}


export function calculatePorosity_calculator(input: Porosity_calculatorInput): Porosity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["porosityPercentage"]);
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


export interface Porosity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
