// @ts-nocheck
// Auto-generated from mass-flow-rate-orifice-calculator-schema.json
import * as z from 'zod';

export interface Mass_flow_rate_orifice_calculatorInput {
  dischargeCoefficient: number;
  orificeArea: number;
  fluidDensity: number;
  pressureDifference: number;
}

export const Mass_flow_rate_orifice_calculatorInputSchema = z.object({
  dischargeCoefficient: z.number().default(0.62),
  orificeArea: z.number().default(0.01),
  fluidDensity: z.number().default(1000),
  pressureDifference: z.number().default(10000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mass_flow_rate_orifice_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.dischargeCoefficient + input.orificeArea + input.fluidDensity; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.dischargeCoefficient + input.orificeArea + input.fluidDensity; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMass_flow_rate_orifice_calculator(input: Mass_flow_rate_orifice_calculatorInput): Mass_flow_rate_orifice_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Mass_flow_rate_orifice_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
