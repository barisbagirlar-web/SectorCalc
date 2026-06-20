// Auto-generated from heat-of-fusion-calculator-schema.json
import * as z from 'zod';

export interface Heat_of_fusion_calculatorInput {
  mass: number;
  specificHeat: number;
  initialTemperature: number;
  meltingTemperature: number;
  latentHeatOfFusion: number;
  dataConfidence?: number;
}

export const Heat_of_fusion_calculatorInputSchema = z.object({
  mass: z.number().default(1),
  specificHeat: z.number().default(4180),
  initialTemperature: z.number().default(20),
  meltingTemperature: z.number().default(0),
  latentHeatOfFusion: z.number().default(334000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Heat_of_fusion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mass * input.specificHeat * (input.meltingTemperature - input.initialTemperature); results["sensibleHeat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sensibleHeat"] = Number.NaN; }
  try { const v = input.mass * input.latentHeatOfFusion; results["latentHeat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["latentHeat"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["sensibleHeat"])) + (toNumericFormulaValue(results["latentHeat"])); results["totalHeat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalHeat"] = Number.NaN; }
  return results;
}


export function calculateHeat_of_fusion_calculator(input: Heat_of_fusion_calculatorInput): Heat_of_fusion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalHeat"]);
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


export interface Heat_of_fusion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
