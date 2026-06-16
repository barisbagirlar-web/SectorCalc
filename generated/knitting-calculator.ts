// Auto-generated from knitting-calculator-schema.json
import * as z from 'zod';

export interface Knitting_calculatorInput {
  fabricWidth: number;
  fabricLength: number;
  stitchGauge: number;
  rowGauge: number;
  yarnPerStitch: number;
  yarnDensity: number;
}

export const Knitting_calculatorInputSchema = z.object({
  fabricWidth: z.number().default(100),
  fabricLength: z.number().default(100),
  stitchGauge: z.number().default(5),
  rowGauge: z.number().default(7),
  yarnPerStitch: z.number().default(1.5),
  yarnDensity: z.number().default(50),
});

function evaluateAllFormulas(input: Knitting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fabricWidth * input.stitchGauge * input.fabricLength * input.rowGauge; results["totalStitches"] = Number.isFinite(v) ? v : 0; } catch { results["totalStitches"] = 0; }
  try { const v = ((results["totalStitches"] ?? 0) * input.yarnPerStitch) / 100; results["totalYarnLength"] = Number.isFinite(v) ? v : 0; } catch { results["totalYarnLength"] = 0; }
  try { const v = (results["totalYarnLength"] ?? 0) * (input.yarnDensity / 1000); results["totalYarnWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalYarnWeight"] = 0; }
  return results;
}


export function calculateKnitting_calculator(input: Knitting_calculatorInput): Knitting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalYarnLength"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Knitting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
