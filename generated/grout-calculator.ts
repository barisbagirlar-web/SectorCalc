// @ts-nocheck
// Auto-generated from grout-calculator-schema.json
import * as z from 'zod';

export interface Grout_calculatorInput {
  tileLength: number;
  tileWidth: number;
  gapWidth: number;
  gapDepth: number;
  totalArea: number;
  wasteFactor: number;
  bagYield: number;
}

export const Grout_calculatorInputSchema = z.object({
  tileLength: z.number().default(300),
  tileWidth: z.number().default(300),
  gapWidth: z.number().default(5),
  gapDepth: z.number().default(10),
  totalArea: z.number().default(10),
  wasteFactor: z.number().default(5),
  bagYield: z.number().default(0.012),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Grout_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.totalArea * input.gapDepth * input.gapWidth * (input.tileLength + input.tileWidth)) / (1000 * input.tileLength * input.tileWidth); results["groutVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["groutVolume"] = 0; }
  try { const v = (asFormulaNumber(results["groutVolume"])) * input.wasteFactor / 100; results["wasteVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wasteVolume"] = 0; }
  try { const v = (asFormulaNumber(results["groutVolume"])) * (1 + input.wasteFactor / 100); results["totalVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = (asFormulaNumber(results["totalVolume"])) / input.bagYield; results["exactBags"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["exactBags"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGrout_calculator(input: Grout_calculatorInput): Grout_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["exactBags"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Grout_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
