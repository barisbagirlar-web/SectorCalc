// Auto-generated from deck-board-calculator-schema.json
import * as z from 'zod';

export interface Deck_board_calculatorInput {
  alan: number;
  tahtaEn: number;
  tahtaBoy: number;
  fire: number;
  dataConfidence?: number;
}

export const Deck_board_calculatorInputSchema = z.object({
  alan: z.number().min(0).default(30),
  tahtaEn: z.number().min(0).default(0.14),
  tahtaBoy: z.number().min(0).default(3),
  fire: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Deck_board_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil((input.alan / Math.max(0.0001, (input.tahtaEn * input.tahtaBoy))) * (1 + input.fire / 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDeck_board_calculator(input: Deck_board_calculatorInput): Deck_board_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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
    unit: "boards",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Deck_board_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Deck_board_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "boards",
  breakdownKeys: ["sonuc"],
} as const;

