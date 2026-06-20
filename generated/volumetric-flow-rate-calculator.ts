// Auto-generated from volumetric-flow-rate-calculator-schema.json
import * as z from 'zod';

export interface Volumetric_flow_rate_calculatorInput {
  innerDiameter: number;
  velocity: number;
  crossSectionArea: number;
  fluidDensity: number;
  massFlowRate: number;
  dataConfidence?: number;
}

export const Volumetric_flow_rate_calculatorInputSchema = z.object({
  innerDiameter: z.number().default(0),
  velocity: z.number().default(0),
  crossSectionArea: z.number().default(0),
  fluidDensity: z.number().default(0),
  massFlowRate: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Volumetric_flow_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.velocity * (input.crossSectionArea > 0 ? input.crossSectionArea : (input.innerDiameter > 0 ? Math.PI * (input.innerDiameter / 2000) ** 2 : 0)); results["flowRateFromAreaVelocity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["flowRateFromAreaVelocity"] = Number.NaN; }
  try { const v = input.fluidDensity > 0 ? input.massFlowRate / input.fluidDensity : 0; results["flowRateFromMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["flowRateFromMass"] = Number.NaN; }
  return results;
}


export function calculateVolumetric_flow_rate_calculator(input: Volumetric_flow_rate_calculatorInput): Volumetric_flow_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["flowRateFromAreaVelocity"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Volumetric_flow_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
