// Auto-generated from smith-chart-calculator-schema.json
import * as z from 'zod';

export interface Smith_chart_calculatorInput {
  loadResistance: number;
  loadReactance: number;
  characteristicImpedance: number;
  distanceWavelengths: number;
}

export const Smith_chart_calculatorInputSchema = z.object({
  loadResistance: z.number().default(50),
  loadReactance: z.number().default(0),
  characteristicImpedance: z.number().default(50),
  distanceWavelengths: z.number().default(0),
});

function evaluateAllFormulas(input: Smith_chart_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loadResistance / input.characteristicImpedance; results["r"] = Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = input.loadReactance / input.characteristicImpedance; results["x"] = Number.isFinite(v) ? v : 0; } catch { results["x"] = 0; }
  try { const v = Math.sqrt((Math.pow((results["r"] ?? 0)-1,2)+Math.pow((results["x"] ?? 0),2))/(Math.pow((results["r"] ?? 0)+1,2)+Math.pow((results["x"] ?? 0),2))); results["mag"] = Number.isFinite(v) ? v : 0; } catch { results["mag"] = 0; }
  try { const v = Math.atan2((results["x"] ?? 0), (results["r"] ?? 0)-1) - Math.atan2((results["x"] ?? 0), (results["r"] ?? 0)+1); results["angleRad"] = Number.isFinite(v) ? v : 0; } catch { results["angleRad"] = 0; }
  try { const v = (results["angleRad"] ?? 0) * 180 / Math.PI; results["angleDeg"] = Number.isFinite(v) ? v : 0; } catch { results["angleDeg"] = 0; }
  try { const v = (1+(results["mag"] ?? 0))/(1-(results["mag"] ?? 0)); results["vswr"] = Number.isFinite(v) ? v : 0; } catch { results["vswr"] = 0; }
  try { const v = (results["mag"] ?? 0) * Math.cos((results["angleRad"] ?? 0) - 4*Math.PI*input.distanceWavelengths); results["realG"] = Number.isFinite(v) ? v : 0; } catch { results["realG"] = 0; }
  try { const v = (results["mag"] ?? 0) * Math.sin((results["angleRad"] ?? 0) - 4*Math.PI*input.distanceWavelengths); results["imagG"] = Number.isFinite(v) ? v : 0; } catch { results["imagG"] = 0; }
  try { const v = Math.pow(1-(results["realG"] ?? 0),2)+Math.pow((results["imagG"] ?? 0),2); results["denMag2"] = Number.isFinite(v) ? v : 0; } catch { results["denMag2"] = 0; }
  try { const v = input.characteristicImpedance * ( (1 - Math.pow((results["realG"] ?? 0),2) - Math.pow((results["imagG"] ?? 0),2)) / (results["denMag2"] ?? 0) ); results["inputImpedanceReal"] = Number.isFinite(v) ? v : 0; } catch { results["inputImpedanceReal"] = 0; }
  try { const v = input.characteristicImpedance * ( 2*(results["imagG"] ?? 0) / (results["denMag2"] ?? 0) ); results["inputImpedanceImag"] = Number.isFinite(v) ? v : 0; } catch { results["inputImpedanceImag"] = 0; }
  try { const v = (results["mag"] ?? 0); results["reflectionCoefficientMagnitude"] = Number.isFinite(v) ? v : 0; } catch { results["reflectionCoefficientMagnitude"] = 0; }
  try { const v = (results["angleDeg"] ?? 0) - 720*input.distanceWavelengths; results["reflectionCoefficientAngleDeg"] = Number.isFinite(v) ? v : 0; } catch { results["reflectionCoefficientAngleDeg"] = 0; }
  try { const v = (results["vswr"] ?? 0); results["VSWR"] = Number.isFinite(v) ? v : 0; } catch { results["VSWR"] = 0; }
  return results;
}


export function calculateSmith_chart_calculator(input: Smith_chart_calculatorInput): Smith_chart_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["inputImpedanceReal"] ?? 0;
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


export interface Smith_chart_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
