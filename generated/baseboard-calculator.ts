// Auto-generated from baseboard-calculator-schema.json
import * as z from 'zod';

export interface Baseboard_calculatorInput {
  roomLength: number;
  roomWidth: number;
  numberOfDoors: number;
  doorWidth: number;
  baseboardLengthPerPiece: number;
  pricePerPiece: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Baseboard_calculatorInputSchema = z.object({
  roomLength: z.number().default(5),
  roomWidth: z.number().default(4),
  numberOfDoors: z.number().default(1),
  doorWidth: z.number().default(0.9),
  baseboardLengthPerPiece: z.number().default(2.4),
  pricePerPiece: z.number().default(10),
  wasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Baseboard_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * (input.roomLength + input.roomWidth); results["perimeter"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["perimeter"] = 0; }
  try { const v = input.numberOfDoors * input.doorWidth; results["doorTotalWidth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["doorTotalWidth"] = 0; }
  try { const v = (asFormulaNumber(results["perimeter"])) - (asFormulaNumber(results["doorTotalWidth"])); results["netLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netLength"] = 0; }
  try { const v = (asFormulaNumber(results["netLength"])) * (1 + input.wasteFactor/100); results["withWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["withWaste"] = 0; }
  try { const v = (asFormulaNumber(results["withWaste"])) - (asFormulaNumber(results["netLength"])); results["wasteLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteLength"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBaseboard_calculator(input: Baseboard_calculatorInput): Baseboard_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["wasteLength"]));
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


export interface Baseboard_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
