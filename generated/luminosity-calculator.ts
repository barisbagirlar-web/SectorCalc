// Auto-generated from luminosity-calculator-schema.json
import * as z from 'zod';

export interface Luminosity_calculatorInput {
  luminousFlux: number;
  beamAngle: number;
  distance: number;
  efficiency: number;
  ambientLight: number;
}

export const Luminosity_calculatorInputSchema = z.object({
  luminousFlux: z.number().default(1000),
  beamAngle: z.number().default(120),
  distance: z.number().default(1),
  efficiency: z.number().default(0.9),
  ambientLight: z.number().default(0),
});

function evaluateAllFormulas(input: Luminosity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * Math.PI * (1 - Math.cos((input.beamAngle / 2) * Math.PI / 180)); results["solidAngle"] = Number.isFinite(v) ? v : 0; } catch { results["solidAngle"] = 0; }
  try { const v = input.luminousFlux * input.efficiency / (results["solidAngle"] ?? 0); results["luminousIntensity"] = Number.isFinite(v) ? v : 0; } catch { results["luminousIntensity"] = 0; }
  try { const v = (results["luminousIntensity"] ?? 0) / (input.distance * input.distance); results["illuminance"] = Number.isFinite(v) ? v : 0; } catch { results["illuminance"] = 0; }
  try { const v = (results["illuminance"] ?? 0) + input.ambientLight; results["totalIlluminance"] = Number.isFinite(v) ? v : 0; } catch { results["totalIlluminance"] = 0; }
  return results;
}


export function calculateLuminosity_calculator(input: Luminosity_calculatorInput): Luminosity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalIlluminance"] ?? 0;
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


export interface Luminosity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
