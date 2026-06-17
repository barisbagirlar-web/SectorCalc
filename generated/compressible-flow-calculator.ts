// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Compressible_flow_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.downstreamPressure / input.upstreamPressure; results["pressureRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pressureRatio"] = 0; }
  try { const v = (2 / (input.specificHeatRatio + 1)) ** (input.specificHeatRatio / (input.specificHeatRatio - 1)); results["criticalPressureRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["criticalPressureRatio"] = 0; }
  results["flowType"] = 0;
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCompressible_flow_calculator(input: Compressible_flow_calculatorInput): Compressible_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["flowType"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
