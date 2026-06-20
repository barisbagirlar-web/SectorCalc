// Auto-generated from wells-dvt-calculator-schema.json
import * as z from 'zod';

export interface Wells_dvt_calculatorInput {
  totalDepth: number;
  shoeDepth: number;
  casingDiameter: number;
  openHoleDiameter: number;
  fluidDensity: number;
  dataConfidence?: number;
}

export const Wells_dvt_calculatorInputSchema = z.object({
  totalDepth: z.number().default(2000),
  shoeDepth: z.number().default(1500),
  casingDiameter: z.number().default(177.8),
  openHoleDiameter: z.number().default(215.9),
  fluidDensity: z.number().default(1200),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wells_dvt_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * ((input.casingDiameter/2000) ** 2 * input.shoeDepth + (input.openHoleDiameter/2000) ** 2 * (input.totalDepth - input.shoeDepth)); results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalVolume"] = Number.NaN; }
  try { const v = Math.PI * (input.casingDiameter/2000) ** 2 * input.shoeDepth; results["volumeCasing"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeCasing"] = Number.NaN; }
  try { const v = input.fluidDensity * 9.81 * input.shoeDepth / 1e5; results["pressureShoe"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pressureShoe"] = Number.NaN; }
  return results;
}


export function calculateWells_dvt_calculator(input: Wells_dvt_calculatorInput): Wells_dvt_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalVolume"]);
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


export interface Wells_dvt_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
