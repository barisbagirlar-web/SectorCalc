// Auto-generated from gasket-calculator-schema.json
import * as z from 'zod';

export interface Gasket_calculatorInput {
  innerDiameter: number;
  outerDiameter: number;
  designPressure: number;
  gasketFactor: number;
  seatingStress: number;
  boltCount: number;
}

export const Gasket_calculatorInputSchema = z.object({
  innerDiameter: z.number().default(50),
  outerDiameter: z.number().default(100),
  designPressure: z.number().default(16),
  gasketFactor: z.number().default(2.5),
  seatingStress: z.number().default(20),
  boltCount: z.number().default(4),
});

function evaluateAllFormulas(input: Gasket_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.designPressure * 0.1; results["pressureMPa"] = Number.isFinite(v) ? v : 0; } catch { results["pressureMPa"] = 0; }
  try { const v = (input.innerDiameter + input.outerDiameter) / 2; results["meanDiam"] = Number.isFinite(v) ? v : 0; } catch { results["meanDiam"] = 0; }
  try { const v = (input.outerDiameter - input.innerDiameter) / 2; results["effWidth"] = Number.isFinite(v) ? v : 0; } catch { results["effWidth"] = 0; }
  try { const v = (Math.PI * (results["meanDiam"] ?? 0)**2 * (results["pressureMPa"] ?? 0) / 4) + (2 * (results["effWidth"] ?? 0) * Math.PI * (results["meanDiam"] ?? 0) * input.gasketFactor * (results["pressureMPa"] ?? 0)); results["operatingForce"] = Number.isFinite(v) ? v : 0; } catch { results["operatingForce"] = 0; }
  try { const v = Math.PI * (results["effWidth"] ?? 0) * (results["meanDiam"] ?? 0) * input.seatingStress; results["seatingForce"] = Number.isFinite(v) ? v : 0; } catch { results["seatingForce"] = 0; }
  try { const v = Math.max((results["operatingForce"] ?? 0), (results["seatingForce"] ?? 0)); results["maxTotalForce"] = Number.isFinite(v) ? v : 0; } catch { results["maxTotalForce"] = 0; }
  try { const v = (results["operatingForce"] ?? 0) / input.boltCount; results["operatingForcePerBolt"] = Number.isFinite(v) ? v : 0; } catch { results["operatingForcePerBolt"] = 0; }
  try { const v = (results["seatingForce"] ?? 0) / input.boltCount; results["seatingForcePerBolt"] = Number.isFinite(v) ? v : 0; } catch { results["seatingForcePerBolt"] = 0; }
  try { const v = (results["maxTotalForce"] ?? 0) / input.boltCount; results["maxForcePerBolt"] = Number.isFinite(v) ? v : 0; } catch { results["maxForcePerBolt"] = 0; }
  try { const v = Math.PI / 4 * (input.outerDiameter**2 - input.innerDiameter**2); results["effectiveArea"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveArea"] = 0; }
  results["_____operatingForce___1000__toFixed_2___"] = 0;
  results["_____seatingForce___1000__toFixed_2_____"] = 0;
  try { const v = ((results["maxTotalForce"] ?? 0) / 1000).toFixed(2) + ' kN'; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateGasket_calculator(input: Gasket_calculatorInput): Gasket_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Gasket_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
