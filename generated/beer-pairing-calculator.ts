// @ts-nocheck
// Auto-generated from beer-pairing-calculator-schema.json
import * as z from 'zod';

export interface Beer_pairing_calculatorInput {
  beerIBU: number;
  beerABV: number;
  foodRichness: number;
  foodSpiciness: number;
  foodAcidity: number;
}

export const Beer_pairing_calculatorInputSchema = z.object({
  beerIBU: z.number().default(30),
  beerABV: z.number().default(5),
  foodRichness: z.number().default(5),
  foodSpiciness: z.number().default(3),
  foodAcidity: z.number().default(3),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Beer_pairing_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.beerIBU + input.beerABV + input.foodRichness; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.beerIBU + input.beerABV + input.foodRichness; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBeer_pairing_calculator(input: Beer_pairing_calculatorInput): Beer_pairing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Beer_pairing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
