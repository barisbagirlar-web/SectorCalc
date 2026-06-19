// Auto-generated from backsplash-calculator-schema.json
import * as z from 'zod';

export interface Backsplash_calculatorInput {
  backsplashWidth: number;
  backsplashHeight: number;
  tileWidth: number;
  tileHeight: number;
  wastePercentage: number;
  dataConfidence?: number;
}

export const Backsplash_calculatorInputSchema = z.object({
  backsplashWidth: z.number().default(200),
  backsplashHeight: z.number().default(60),
  tileWidth: z.number().default(10),
  tileHeight: z.number().default(10),
  wastePercentage: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Backsplash_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.backsplashWidth * input.backsplashHeight) / 10000; results["totalAreaM2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAreaM2"] = 0; }
  try { const v = (asFormulaNumber(results["totalAreaM2"])) * (input.wastePercentage / 100); results["wasteAreaM2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteAreaM2"] = 0; }
  try { const v = (asFormulaNumber(results["totalAreaM2"])) * (1 + input.wastePercentage / 100); results["totalAreaWithWasteM2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAreaWithWasteM2"] = 0; }
  try { const v = (input.backsplashWidth * input.backsplashHeight) / (input.tileWidth * input.tileHeight) * (1 + input.wastePercentage / 100); results["exactTilesNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["exactTilesNeeded"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBacksplash_calculator(input: Backsplash_calculatorInput): Backsplash_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["exactTilesNeeded"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Backsplash_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
