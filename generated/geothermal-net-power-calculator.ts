// Auto-generated from geothermal-net-power-calculator-schema.json
import * as z from 'zod';

export interface Geothermal_net_power_calculatorInput {
  massFlowRate: number;
  specificHeat: number;
  inletTemp: number;
  outletTemp: number;
  conversionEfficiency: number;
  parasiticLoad: number;
  dataConfidence?: number;
}

export const Geothermal_net_power_calculatorInputSchema = z.object({
  massFlowRate: z.number().default(50),
  specificHeat: z.number().default(4200),
  inletTemp: z.number().default(150),
  outletTemp: z.number().default(80),
  conversionEfficiency: z.number().default(12),
  parasiticLoad: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Geothermal_net_power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massFlowRate * input.specificHeat * (input.inletTemp - input.outletTemp) * (input.conversionEfficiency / 100) / 1000; results["grossPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossPower"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossPower"])) - input.parasiticLoad; results["netPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netPower"] = Number.NaN; }
  return results;
}


export function calculateGeothermal_net_power_calculator(input: Geothermal_net_power_calculatorInput): Geothermal_net_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netPower"]);
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


export interface Geothermal_net_power_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
