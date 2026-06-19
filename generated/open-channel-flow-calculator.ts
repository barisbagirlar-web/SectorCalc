// Auto-generated from open-channel-flow-calculator-schema.json
import * as z from 'zod';

export interface Open_channel_flow_calculatorInput {
  bottomWidth: number;
  depth: number;
  sideSlope: number;
  manningN: number;
  slope: number;
  gravity: number;
  dataConfidence?: number;
}

export const Open_channel_flow_calculatorInputSchema = z.object({
  bottomWidth: z.number().default(2),
  depth: z.number().default(1),
  sideSlope: z.number().default(1.5),
  manningN: z.number().default(0.013),
  slope: z.number().default(0.001),
  gravity: z.number().default(9.81),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Open_channel_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bottomWidth + input.sideSlope * input.depth) * input.depth; results["A"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["A"] = 0; }
  try { const v = input.bottomWidth + 2 * input.sideSlope * input.depth; results["TopWidth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["TopWidth"] = 0; }
  try { const v = (asFormulaNumber(results["A"])) / (asFormulaNumber(results["TopWidth"])); results["HydraulicDepth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["HydraulicDepth"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOpen_channel_flow_calculator(input: Open_channel_flow_calculatorInput): Open_channel_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["HydraulicDepth"]);
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


export interface Open_channel_flow_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
