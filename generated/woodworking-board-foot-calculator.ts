// @ts-nocheck
// Auto-generated from woodworking-board-foot-calculator-schema.json
import * as z from 'zod';

export interface Woodworking_board_foot_calculatorInput {
  length: number;
  width: number;
  thickness: number;
  quantity: number;
  waste: number;
  price: number;
}

export const Woodworking_board_foot_calculatorInputSchema = z.object({
  length: z.number().default(96),
  width: z.number().default(6),
  thickness: z.number().default(1),
  quantity: z.number().default(1),
  waste: z.number().default(10),
  price: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Woodworking_board_foot_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.length * input.width * input.thickness / 144; results["boardFeetPerPiece"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["boardFeetPerPiece"] = 0; }
  try { const v = (asFormulaNumber(results["boardFeetPerPiece"])) * input.quantity * (1 + input.waste / 100); results["totalBoardFeet"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalBoardFeet"] = 0; }
  try { const v = (asFormulaNumber(results["totalBoardFeet"])) * input.price; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWoodworking_board_foot_calculator(input: Woodworking_board_foot_calculatorInput): Woodworking_board_foot_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBoardFeet"]);
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


export interface Woodworking_board_foot_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
