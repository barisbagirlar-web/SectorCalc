// Auto-generated from knitting-calculator-schema.json
import * as z from 'zod';

export interface Knitting_calculatorInput {
  fabricWidth: number;
  fabricLength: number;
  stitchGauge: number;
  rowGauge: number;
  yarnPerStitch: number;
  yarnDensity: number;
  dataConfidence?: number;
}

export const Knitting_calculatorInputSchema = z.object({
  fabricWidth: z.number().default(100),
  fabricLength: z.number().default(100),
  stitchGauge: z.number().default(5),
  rowGauge: z.number().default(7),
  yarnPerStitch: z.number().default(1.5),
  yarnDensity: z.number().default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Knitting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fabricWidth * input.stitchGauge * input.fabricLength * input.rowGauge; results["totalStitches"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalStitches"] = 0; }
  try { const v = ((asFormulaNumber(results["totalStitches"])) * input.yarnPerStitch) / 100; results["totalYarnLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalYarnLength"] = 0; }
  try { const v = (asFormulaNumber(results["totalYarnLength"])) * (input.yarnDensity / 1000); results["totalYarnWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalYarnWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKnitting_calculator(input: Knitting_calculatorInput): Knitting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalYarnLength"]);
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


export interface Knitting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
