// @ts-nocheck
// Auto-generated from deck-railing-calculator-schema.json
import * as z from 'zod';

export interface Deck_railing_calculatorInput {
  totalLength: number;
  postWidth: number;
  numberOfPosts: number;
  balusterWidth: number;
  maxGap: number;
}

export const Deck_railing_calculatorInputSchema = z.object({
  totalLength: z.number().default(5),
  postWidth: z.number().default(0.1),
  numberOfPosts: z.number().default(2),
  balusterWidth: z.number().default(0.02),
  maxGap: z.number().default(0.1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Deck_railing_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalLength - input.numberOfPosts * input.postWidth; results["availableLength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["availableLength"] = 0; }
  try { const v = input.totalLength - input.numberOfPosts * input.postWidth; results["availableLength_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["availableLength_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDeck_railing_calculator(input: Deck_railing_calculatorInput): Deck_railing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["availableLength_aux"]);
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


export interface Deck_railing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
