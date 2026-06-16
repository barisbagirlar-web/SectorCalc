// Auto-generated from banjo-calculator-schema.json
import * as z from 'zod';

export interface Banjo_calculatorInput {
  boltInnerDiameter: number;
  holeDiameter: number;
  numberOfHoles: number;
  fluidDensity: number;
  fluidViscosity: number;
  pressureDifference: number;
  dischargeCoefficient: number;
}

export const Banjo_calculatorInputSchema = z.object({
  boltInnerDiameter: z.number().default(10),
  holeDiameter: z.number().default(5),
  numberOfHoles: z.number().default(2),
  fluidDensity: z.number().default(870),
  fluidViscosity: z.number().default(0.028),
  pressureDifference: z.number().default(100000),
  dischargeCoefficient: z.number().default(0.62),
});

function evaluateAllFormulas(input: Banjo_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * Math.pow(input.boltInnerDiameter / 2000, 2); results["boreArea"] = Number.isFinite(v) ? v : 0; } catch { results["boreArea"] = 0; }
  try { const v = Math.PI * Math.pow(input.holeDiameter / 2000, 2) * input.numberOfHoles; results["holeArea"] = Number.isFinite(v) ? v : 0; } catch { results["holeArea"] = 0; }
  try { const v = Math.min((results["boreArea"] ?? 0), (results["holeArea"] ?? 0)); results["effectiveArea"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveArea"] = 0; }
  try { const v = input.dischargeCoefficient * (results["effectiveArea"] ?? 0) * Math.sqrt(2 * input.pressureDifference / input.fluidDensity); results["flowRate"] = Number.isFinite(v) ? v : 0; } catch { results["flowRate"] = 0; }
  try { const v = (results["flowRate"] ?? 0) * 60000; results["flowRateLpm"] = Number.isFinite(v) ? v : 0; } catch { results["flowRateLpm"] = 0; }
  try { const v = (results["flowRate"] ?? 0) / (results["effectiveArea"] ?? 0); results["velocity"] = Number.isFinite(v) ? v : 0; } catch { results["velocity"] = 0; }
  try { const v = ((results["boreArea"] ?? 0) <= (results["holeArea"] ?? 0)) ? input.boltInnerDiameter : input.holeDiameter; results["characteristicDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["characteristicDiameter"] = 0; }
  try { const v = input.fluidDensity * (results["velocity"] ?? 0) * ((results["characteristicDiameter"] ?? 0) / 1000) / input.fluidViscosity; results["reynoldsNumber"] = Number.isFinite(v) ? v : 0; } catch { results["reynoldsNumber"] = 0; }
  return results;
}


export function calculateBanjo_calculator(input: Banjo_calculatorInput): Banjo_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["flowRateLpm"] ?? 0;
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


export interface Banjo_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
