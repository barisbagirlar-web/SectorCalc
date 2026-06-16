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

function evaluateAllFormulas(input: Porosity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.particleDensity - input.bulkDensity) / input.particleDensity; results["porosityFraction"] = Number.isFinite(v) ? v : 0; } catch { results["porosityFraction"] = 0; }
  try { const v = (results["porosityFraction"] ?? 0) * 100; results["porosityPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["porosityPercentage"] = 0; }
  try { const v = input.poreVolume / input.totalVolume; results["volumetricPorosityFraction"] = Number.isFinite(v) ? v : 0; } catch { results["volumetricPorosityFraction"] = 0; }
  try { const v = (results["volumetricPorosityFraction"] ?? 0) * 100; results["volumetricPorosityPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["volumetricPorosityPercentage"] = 0; }
  return results;
}


export function calculatePorosity_calculator(input: Porosity_calculatorInput): Porosity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["porosityPercentage"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
