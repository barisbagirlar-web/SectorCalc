// Auto-generated from luminosity-calculator-schema.json
import * as z from 'zod';

export interface Luminosity_calculatorInput {
  luminousFlux: number;
  beamAngle: number;
  distance: number;
  efficiency: number;
  ambientLight: number;
  dataConfidence?: number;
}

export const Luminosity_calculatorInputSchema = z.object({
  luminousFlux: z.number().default(1000),
  beamAngle: z.number().default(120),
  distance: z.number().default(1),
  efficiency: z.number().default(0.9),
  ambientLight: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Luminosity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.luminousFlux * input.beamAngle * input.distance * (input.efficiency / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.luminousFlux * input.beamAngle * input.distance * (input.efficiency / 100) * (input.ambientLight); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.ambientLight; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLuminosity_calculator(input: Luminosity_calculatorInput): Luminosity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Luminosity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
