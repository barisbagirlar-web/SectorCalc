// Auto-generated from stain-calculator-schema.json
import * as z from 'zod';

export interface Stain_calculatorInput {
  surfaceArea: number;
  stainIntensity: number;
  coverageRate: number;
  efficiency: number;
  numberOfCoats: number;
  dataConfidence?: number;
}

export const Stain_calculatorInputSchema = z.object({
  surfaceArea: z.number().default(10),
  stainIntensity: z.number().default(50),
  coverageRate: z.number().default(10),
  efficiency: z.number().default(80),
  numberOfCoats: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Stain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coverageRate * (input.efficiency / 100); results["effectiveCoverage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveCoverage"] = Number.NaN; }
  try { const v = (input.surfaceArea * input.numberOfCoats * (input.stainIntensity / 100)) / input.coverageRate; results["rawRequiredVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawRequiredVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rawRequiredVolume"])) * (100 / input.efficiency); results["totalRequiredVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRequiredVolume"] = Number.NaN; }
  return results;
}


export function calculateStain_calculator(input: Stain_calculatorInput): Stain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRequiredVolume"]);
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


export interface Stain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
