// Auto-generated from earth-pressure-calculator-schema.json
import * as z from 'zod';

export interface Earth_pressure_calculatorInput {
  height: number;
  soilUnitWeight: number;
  frictionAngle: number;
  cohesion: number;
  surcharge: number;
}

export const Earth_pressure_calculatorInputSchema = z.object({
  height: z.number().default(3),
  soilUnitWeight: z.number().default(18),
  frictionAngle: z.number().default(30),
  cohesion: z.number().default(0),
  surcharge: z.number().default(0),
});

function evaluateAllFormulas(input: Earth_pressure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 - Math.sin(input.frictionAngle * Math.PI / 180)) / (1 + Math.sin(input.frictionAngle * Math.PI / 180)); results["activePressureCoefficient"] = Number.isFinite(v) ? v : 0; } catch { results["activePressureCoefficient"] = 0; }
  try { const v = (1 + Math.sin(input.frictionAngle * Math.PI / 180)) / (1 - Math.sin(input.frictionAngle * Math.PI / 180)); results["passivePressureCoefficient"] = Number.isFinite(v) ? v : 0; } catch { results["passivePressureCoefficient"] = 0; }
  try { const v = ((1 - Math.sin(input.frictionAngle * Math.PI / 180)) / (1 + Math.sin(input.frictionAngle * Math.PI / 180))) * (input.soilUnitWeight * input.height + input.surcharge); results["basePressureActive"] = Number.isFinite(v) ? v : 0; } catch { results["basePressureActive"] = 0; }
  try { const v = ((1 - Math.sin(input.frictionAngle * Math.PI / 180)) / (1 + Math.sin(input.frictionAngle * Math.PI / 180))) * (0.5 * input.soilUnitWeight * input.height ** 2 + input.surcharge * input.height); results["totalActiveForce"] = Number.isFinite(v) ? v : 0; } catch { results["totalActiveForce"] = 0; }
  try { const v = ((1 - Math.sin(input.frictionAngle * Math.PI / 180)) / (1 + Math.sin(input.frictionAngle * Math.PI / 180))) * (input.soilUnitWeight * input.height ** 3 / 3 + input.surcharge * input.height ** 2 / 2); results["momentBaseActive"] = Number.isFinite(v) ? v : 0; } catch { results["momentBaseActive"] = 0; }
  return results;
}


export function calculateEarth_pressure_calculator(input: Earth_pressure_calculatorInput): Earth_pressure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalActiveForce"] ?? 0;
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


export interface Earth_pressure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
