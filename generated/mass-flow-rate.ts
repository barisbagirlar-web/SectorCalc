// Auto-generated from mass-flow-rate-schema.json
import * as z from 'zod';

export interface Mass_flow_rateInput {
  density: number;
  velocity: number;
  diameter: number;
  temperature: number;
  pressure: number;
  compressibility: number;
  dataConfidence?: number;
}

export const Mass_flow_rateInputSchema = z.object({
  density: z.number().default(1000),
  velocity: z.number().default(2),
  diameter: z.number().default(0.1),
  temperature: z.number().default(20),
  pressure: z.number().default(1),
  compressibility: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mass_flow_rateInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * (input.diameter / 2) ** 2; results["crossSectionArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["crossSectionArea"] = Number.NaN; }
  try { const v = input.density * input.velocity * (toNumericFormulaValue(results["crossSectionArea"])); results["massFlowRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["massFlowRate"] = Number.NaN; }
  try { const v = input.velocity * (toNumericFormulaValue(results["crossSectionArea"])); results["volumetricFlowRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumetricFlowRate"] = Number.NaN; }
  try { const v = input.density * (input.pressure / 1.01325) * (273.15 / (273.15 + input.temperature)) * input.compressibility; results["correctedDensity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["correctedDensity"] = Number.NaN; }
  return results;
}


export function calculateMass_flow_rate(input: Mass_flow_rateInput): Mass_flow_rateOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["massFlowRate"]);
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


export interface Mass_flow_rateOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
