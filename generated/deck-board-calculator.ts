// @ts-nocheck
// Auto-generated from deck-board-calculator-schema.json
import * as z from 'zod';

export interface Deck_board_calculatorInput {
  deckLength: number;
  deckWidth: number;
  boardLength: number;
  boardWidth: number;
  gap: number;
  wasteFactor: number;
}

export const Deck_board_calculatorInputSchema = z.object({
  deckLength: z.number().default(12),
  deckWidth: z.number().default(10),
  boardLength: z.number().default(8),
  boardWidth: z.number().default(5.5),
  gap: z.number().default(0.125),
  wasteFactor: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Deck_board_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.deckLength * input.deckWidth; results["deckArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deckArea"] = 0; }
  try { const v = input.boardLength * ((input.boardWidth + input.gap) / 12); results["boardArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["boardArea"] = 0; }
  try { const v = (input.deckLength * input.deckWidth) / (input.boardLength * ((input.boardWidth + input.gap) / 12)); results["rawCount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawCount"] = 0; }
  try { const v = (input.deckLength * input.deckWidth) / (input.boardLength * ((input.boardWidth + input.gap) / 12)) * (1 + input.wasteFactor / 100); results["totalBoards"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalBoards"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDeck_board_calculator(input: Deck_board_calculatorInput): Deck_board_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBoards"]);
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


export interface Deck_board_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
