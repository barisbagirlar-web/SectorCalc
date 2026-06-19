// Auto-generated from drip-irrigation-calculator-schema.json
import * as z from 'zod';

export interface Drip_irrigation_calculatorInput {
  area: number;
  emitterFlowRate: number;
  emitterSpacing: number;
  lateralSpacing: number;
  irrigationDepth: number;
  systemEfficiency: number;
  dataConfidence?: number;
}

export const Drip_irrigation_calculatorInputSchema = z.object({
  area: z.number().default(1000),
  emitterFlowRate: z.number().default(2),
  emitterSpacing: z.number().default(0.3),
  lateralSpacing: z.number().default(1),
  irrigationDepth: z.number().default(10),
  systemEfficiency: z.number().default(90),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Drip_irrigation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / (input.emitterSpacing * input.lateralSpacing); results["emittersPerSquareMeter"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["emittersPerSquareMeter"] = 0; }
  try { const v = input.area * (asFormulaNumber(results["emittersPerSquareMeter"])); results["totalEmitters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalEmitters"] = 0; }
  try { const v = (asFormulaNumber(results["totalEmitters"])) * input.emitterFlowRate; results["totalFlowRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFlowRate"] = 0; }
  try { const v = input.irrigationDepth * input.area; results["netVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netVolume"] = 0; }
  try { const v = (asFormulaNumber(results["netVolume"])) / (input.systemEfficiency / 100); results["grossVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossVolume"] = 0; }
  try { const v = (asFormulaNumber(results["grossVolume"])) / (asFormulaNumber(results["totalFlowRate"])); results["irrigationTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["irrigationTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDrip_irrigation_calculator(input: Drip_irrigation_calculatorInput): Drip_irrigation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["irrigationTime"]);
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


export interface Drip_irrigation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
