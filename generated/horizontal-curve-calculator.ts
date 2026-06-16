// Auto-generated from horizontal-curve-calculator-schema.json
import * as z from 'zod';

export interface Horizontal_curve_calculatorInput {
  designSpeed: number;
  superelevation: number;
  frictionFactor: number;
  centralAngle: number;
  stationPI: number;
}

export const Horizontal_curve_calculatorInputSchema = z.object({
  designSpeed: z.number().default(60),
  superelevation: z.number().default(6),
  frictionFactor: z.number().default(0.15),
  centralAngle: z.number().default(90),
  stationPI: z.number().default(1000),
});

function evaluateAllFormulas(input: Horizontal_curve_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow(input.designSpeed, 2) / (127 * (input.superelevation / 100 + input.frictionFactor)); results["radius"] = Number.isFinite(v) ? v : 0; } catch { results["radius"] = 0; }
  try { const v = (results["radius"] ?? 0) * Math.tan(input.centralAngle * Math.PI / 360); results["tangent"] = Number.isFinite(v) ? v : 0; } catch { results["tangent"] = 0; }
  try { const v = (Math.PI * (results["radius"] ?? 0) * input.centralAngle) / 180; results["curveLength"] = Number.isFinite(v) ? v : 0; } catch { results["curveLength"] = 0; }
  try { const v = 2 * (results["radius"] ?? 0) * Math.sin(input.centralAngle * Math.PI / 360); results["chord"] = Number.isFinite(v) ? v : 0; } catch { results["chord"] = 0; }
  try { const v = (results["radius"] ?? 0) * (1 / Math.cos(input.centralAngle * Math.PI / 360) - 1); results["externalDistance"] = Number.isFinite(v) ? v : 0; } catch { results["externalDistance"] = 0; }
  try { const v = (results["radius"] ?? 0) * (1 - Math.cos(input.centralAngle * Math.PI / 360)); results["middleOrdinate"] = Number.isFinite(v) ? v : 0; } catch { results["middleOrdinate"] = 0; }
  try { const v = input.stationPI - (results["tangent"] ?? 0); results["stationPC"] = Number.isFinite(v) ? v : 0; } catch { results["stationPC"] = 0; }
  try { const v = (results["stationPC"] ?? 0) + (results["curveLength"] ?? 0); results["stationPT"] = Number.isFinite(v) ? v : 0; } catch { results["stationPT"] = 0; }
  return results;
}


export function calculateHorizontal_curve_calculator(input: Horizontal_curve_calculatorInput): Horizontal_curve_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["curveLength"] ?? 0;
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


export interface Horizontal_curve_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
