// Auto-generated from mastic-calculator-schema.json
import * as z from 'zod';

export interface Mastic_calculatorInput {
  jointLength: number;
  jointWidth: number;
  jointDepth: number;
  numberOfJoints: number;
  cartridgeVolume: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Mastic_calculatorInputSchema = z.object({
  jointLength: z.number().default(1000),
  jointWidth: z.number().default(10),
  jointDepth: z.number().default(10),
  numberOfJoints: z.number().default(1),
  cartridgeVolume: z.number().default(300),
  wasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mastic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.jointLength * input.jointWidth * input.jointDepth * input.numberOfJoints / 1000; results["totalVolumeMl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVolumeMl"] = 0; }
  try { const v = (asFormulaNumber(results["totalVolumeMl"])) * (1 + input.wasteFactor / 100); results["totalVolumeWithWasteMl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVolumeWithWasteMl"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMastic_calculator(input: Mastic_calculatorInput): Mastic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalVolumeWithWasteMl"]);
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


export interface Mastic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
