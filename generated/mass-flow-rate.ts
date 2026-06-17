// @ts-nocheck
// Auto-generated from mass-flow-rate-schema.json
import * as z from 'zod';

export interface Mass_flow_rateInput {
  density: number;
  velocity: number;
  diameter: number;
  temperature: number;
  pressure: number;
  compressibility: number;
}

export const Mass_flow_rateInputSchema = z.object({
  density: z.number().default(1000),
  velocity: z.number().default(2),
  diameter: z.number().default(0.1),
  temperature: z.number().default(20),
  pressure: z.number().default(1),
  compressibility: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mass_flow_rateInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = Math.PI * (input.diameter / 2) ** 2; results["crossSectionArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["crossSectionArea"] = 0; }
  try { const v = input.density * input.velocity * (asFormulaNumber(results["crossSectionArea"])); results["massFlowRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["massFlowRate"] = 0; }
  try { const v = input.velocity * (asFormulaNumber(results["crossSectionArea"])); results["volumetricFlowRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["volumetricFlowRate"] = 0; }
  try { const v = input.density * (input.pressure / 1.01325) * (273.15 / (273.15 + input.temperature)) * input.compressibility; results["correctedDensity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["correctedDensity"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMass_flow_rate(input: Mass_flow_rateInput): Mass_flow_rateOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["massFlowRate"]);
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


export interface Mass_flow_rateOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
