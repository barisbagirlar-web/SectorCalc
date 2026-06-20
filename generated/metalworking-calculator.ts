// Auto-generated from metalworking-calculator-schema.json
import * as z from 'zod';

export interface Metalworking_calculatorInput {
  spindleSpeed: number;
  toolDiameter: number;
  numberFlutes: number;
  chipLoad: number;
  axialDepthOfCut: number;
  radialWidthOfCut: number;
  dataConfidence?: number;
}

export const Metalworking_calculatorInputSchema = z.object({
  spindleSpeed: z.number().default(1500),
  toolDiameter: z.number().default(10),
  numberFlutes: z.number().default(4),
  chipLoad: z.number().default(0.1),
  axialDepthOfCut: z.number().default(5),
  radialWidthOfCut: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Metalworking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * input.toolDiameter * input.spindleSpeed / 1000; results["cuttingSpeed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cuttingSpeed"] = Number.NaN; }
  try { const v = input.numberFlutes * input.chipLoad * input.spindleSpeed; results["feedRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["feedRate"] = Number.NaN; }
  try { const v = input.numberFlutes * input.chipLoad * input.spindleSpeed * input.axialDepthOfCut * input.radialWidthOfCut; results["materialRemovalRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialRemovalRate"] = Number.NaN; }
  return results;
}


export function calculateMetalworking_calculator(input: Metalworking_calculatorInput): Metalworking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["materialRemovalRate"]);
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


export interface Metalworking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
