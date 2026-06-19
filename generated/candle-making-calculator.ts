// Auto-generated from candle-making-calculator-schema.json
import * as z from 'zod';

export interface Candle_making_calculatorInput {
  containerVolume: number;
  numberOfCandles: number;
  waxDensity: number;
  fragranceLoad: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Candle_making_calculatorInputSchema = z.object({
  containerVolume: z.number().default(200),
  numberOfCandles: z.number().default(1),
  waxDensity: z.number().default(0.9),
  fragranceLoad: z.number().default(8),
  wasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Candle_making_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.containerVolume * input.waxDensity; results["waxPerCandle"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["waxPerCandle"] = 0; }
  try { const v = (asFormulaNumber(results["waxPerCandle"])) * input.fragranceLoad / 100; results["fragrancePerCandle"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fragrancePerCandle"] = 0; }
  try { const v = (asFormulaNumber(results["waxPerCandle"])) * input.numberOfCandles * (1 + input.wasteFactor / 100); results["totalWaxNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWaxNeeded"] = 0; }
  try { const v = (asFormulaNumber(results["fragrancePerCandle"])) * input.numberOfCandles * (1 + input.wasteFactor / 100); results["totalFragranceNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFragranceNeeded"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCandle_making_calculator(input: Candle_making_calculatorInput): Candle_making_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalWaxNeeded"]));
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


export interface Candle_making_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
