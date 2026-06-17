// @ts-nocheck
// Auto-generated from deck-stain-calculator-schema.json
import * as z from 'zod';

export interface Deck_stain_calculatorInput {
  length: number;
  width: number;
  coverage: number;
  coats: number;
  waste: number;
}

export const Deck_stain_calculatorInputSchema = z.object({
  length: z.number().default(20),
  width: z.number().default(12),
  coverage: z.number().default(250),
  coats: z.number().default(2),
  waste: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Deck_stain_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.length * input.width; results["deckArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deckArea"] = 0; }
  try { const v = (asFormulaNumber(results["deckArea"])) * input.coats; results["totalAreaToCover"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalAreaToCover"] = 0; }
  try { const v = (asFormulaNumber(results["totalAreaToCover"])) * (1 + input.waste / 100); results["adjustedArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedArea"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedArea"])) / input.coverage; results["totalGallons"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalGallons"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDeck_stain_calculator(input: Deck_stain_calculatorInput): Deck_stain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalGallons"]);
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


export interface Deck_stain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
