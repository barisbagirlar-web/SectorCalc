// Auto-generated from mass-volume-percent-calculator-schema.json
import * as z from 'zod';

export interface Mass_volume_percent_calculatorInput {
  massSolute_g: number;
  massSolute_kg: number;
  volumeSolution_mL: number;
  volumeSolution_L: number;
  dataConfidence?: number;
}

export const Mass_volume_percent_calculatorInputSchema = z.object({
  massSolute_g: z.number().default(0),
  massSolute_kg: z.number().default(0),
  volumeSolution_mL: z.number().default(0),
  volumeSolution_L: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mass_volume_percent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massSolute_g + input.massSolute_kg * 1000; results["totalMass_g"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMass_g"] = 0; }
  try { const v = input.volumeSolution_mL + input.volumeSolution_L * 1000; results["totalVolume_mL"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVolume_mL"] = 0; }
  try { const v = (asFormulaNumber(results["totalMass_g"])) / (asFormulaNumber(results["totalVolume_mL"])) * 100; results["percent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["percent"] = 0; }
  try { const v = (asFormulaNumber(results["totalMass_g"])) / (asFormulaNumber(results["totalVolume_mL"])); results["ratio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ratio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMass_volume_percent_calculator(input: Mass_volume_percent_calculatorInput): Mass_volume_percent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["percent"]));
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


export interface Mass_volume_percent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
