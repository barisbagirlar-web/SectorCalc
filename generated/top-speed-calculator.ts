// Auto-generated from top-speed-calculator-schema.json
import * as z from 'zod';

export interface Top_speed_calculatorInput {
  enginePower: number;
  dragCoefficient: number;
  frontalArea: number;
  vehicleMass: number;
  rollingResistanceCoefficient: number;
  airDensity: number;
  drivetrainEfficiency: number;
}

export const Top_speed_calculatorInputSchema = z.object({
  enginePower: z.number().default(100),
  dragCoefficient: z.number().default(0.3),
  frontalArea: z.number().default(2.2),
  vehicleMass: z.number().default(1500),
  rollingResistanceCoefficient: z.number().default(0.015),
  airDensity: z.number().default(1.225),
  drivetrainEfficiency: z.number().default(85),
});

function evaluateAllFormulas(input: Top_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * input.airDensity * input.dragCoefficient * input.frontalArea; results["a"] = Number.isFinite(v) ? v : 0; } catch { results["a"] = 0; }
  try { const v = input.rollingResistanceCoefficient * input.vehicleMass * gravitationalAcceleration; results["b"] = Number.isFinite(v) ? v : 0; } catch { results["b"] = 0; }
  try { const v = input.enginePower * (input.drivetrainEfficiency / 100); results["availablePower"] = Number.isFinite(v) ? v : 0; } catch { results["availablePower"] = 0; }
  try { const v = ((results["availablePower"] ?? 0) / (2 * (results["a"] ?? 0))) ** 2 + ((results["b"] ?? 0) / (3 * (results["a"] ?? 0))) ** 3; results["discriminantPart"] = Number.isFinite(v) ? v : 0; } catch { results["discriminantPart"] = 0; }
  try { const v = Math.cbrt( ((results["availablePower"] ?? 0)/(2*(results["a"] ?? 0))) + Math.sqrt((results["discriminantPart"] ?? 0)) ) + Math.cbrt( ((results["availablePower"] ?? 0)/(2*(results["a"] ?? 0))) - Math.sqrt((results["discriminantPart"] ?? 0)) ); results["topSpeedMS"] = Number.isFinite(v) ? v : 0; } catch { results["topSpeedMS"] = 0; }
  try { const v = (results["topSpeedMS"] ?? 0) * 3.6; results["topSpeedKPH"] = Number.isFinite(v) ? v : 0; } catch { results["topSpeedKPH"] = 0; }
  try { const v = (results["a"] ?? 0) * (results["topSpeedMS"] ?? 0) ** 3; results["dragPowerAtTopSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["dragPowerAtTopSpeed"] = 0; }
  try { const v = (results["b"] ?? 0) * (results["topSpeedMS"] ?? 0); results["rollingPowerAtTopSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["rollingPowerAtTopSpeed"] = 0; }
  return results;
}


export function calculateTop_speed_calculator(input: Top_speed_calculatorInput): Top_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["topSpeedKPH"] ?? 0;
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


export interface Top_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
