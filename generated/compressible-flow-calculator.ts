// Auto-generated from compressible-flow-calculator-schema.json
import * as z from 'zod';

export interface Compressible_flow_calculatorInput {
  upstreamPressure: number;
  downstreamPressure: number;
  temperature: number;
  gasConstant: number;
  specificHeatRatio: number;
  orificeDiameter: number;
  dischargeCoefficient: number;
  dataConfidence?: number;
}

export const Compressible_flow_calculatorInputSchema = z.object({
  upstreamPressure: z.number().default(5),
  downstreamPressure: z.number().default(1),
  temperature: z.number().default(293.15),
  gasConstant: z.number().default(287),
  specificHeatRatio: z.number().default(1.4),
  orificeDiameter: z.number().default(10),
  dischargeCoefficient: z.number().default(0.85),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Compressible_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.upstreamPressure) / (input.downstreamPressure + input.temperature + input.gasConstant + input.specificHeatRatio + input.orificeDiameter + input.dischargeCoefficient) * 100; results["pressureRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pressureRatio"] = Number.NaN; }
  try { const v = (input.upstreamPressure) / (input.downstreamPressure + input.temperature) * 100; results["criticalPressureRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["criticalPressureRatio"] = Number.NaN; }
  return results;
}


export function calculateCompressible_flow_calculator(input: Compressible_flow_calculatorInput): Compressible_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["criticalPressureRatio"]);
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


export interface Compressible_flow_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
