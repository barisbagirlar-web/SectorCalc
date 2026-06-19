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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coverageRate * (input.efficiency / 100); results["effectiveCoverage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveCoverage"] = 0; }
  try { const v = (input.surfaceArea * input.numberOfCoats * (input.stainIntensity / 100)) / input.coverageRate; results["rawRequiredVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawRequiredVolume"] = 0; }
  try { const v = (asFormulaNumber(results["rawRequiredVolume"])) * (100 / input.efficiency); results["totalRequiredVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRequiredVolume"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStain_calculator(input: Stain_calculatorInput): Stain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalRequiredVolume"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
