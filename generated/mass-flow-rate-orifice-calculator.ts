// Auto-generated from mass-flow-rate-orifice-calculator-schema.json
import * as z from 'zod';

export interface Mass_flow_rate_orifice_calculatorInput {
  dischargeCoefficient: number;
  orificeArea: number;
  fluidDensity: number;
  pressureDifference: number;
  dataConfidence?: number;
}

export const Mass_flow_rate_orifice_calculatorInputSchema = z.object({
  dischargeCoefficient: z.number().default(0.62),
  orificeArea: z.number().default(0.01),
  fluidDensity: z.number().default(1000),
  pressureDifference: z.number().default(10000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mass_flow_rate_orifice_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dischargeCoefficient * input.orificeArea * input.fluidDensity * input.pressureDifference; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.dischargeCoefficient * input.orificeArea * input.fluidDensity * input.pressureDifference; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateMass_flow_rate_orifice_calculator(input: Mass_flow_rate_orifice_calculatorInput): Mass_flow_rate_orifice_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Mass_flow_rate_orifice_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
