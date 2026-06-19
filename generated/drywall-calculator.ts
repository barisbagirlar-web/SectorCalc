// Auto-generated from drywall-calculator-schema.json
import * as z from 'zod';

export interface Drywall_calculatorInput {
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  numberOfDoors: number;
  numberOfWindows: number;
  panelArea: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Drywall_calculatorInputSchema = z.object({
  roomLength: z.number().default(5),
  roomWidth: z.number().default(4),
  roomHeight: z.number().default(2.5),
  numberOfDoors: z.number().default(1),
  numberOfWindows: z.number().default(2),
  panelArea: z.number().default(2.88),
  wasteFactor: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Drywall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (2 * (input.roomLength + input.roomWidth)) * input.roomHeight; results["totalWallArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWallArea"] = 0; }
  try { const v = input.numberOfDoors * 2 + input.numberOfWindows * 1.5; results["totalOpenings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalOpenings"] = 0; }
  try { const v = (asFormulaNumber(results["totalWallArea"])) - (asFormulaNumber(results["totalOpenings"])); results["netArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netArea"] = 0; }
  try { const v = (asFormulaNumber(results["netArea"])) * (1 + input.wasteFactor / 100); results["totalAreaWithWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAreaWithWaste"] = 0; }
  try { const v = (asFormulaNumber(results["totalAreaWithWaste"])) * 0.4; results["compound_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["compound_kg"] = 0; }
  try { const v = (asFormulaNumber(results["totalAreaWithWaste"])) * 1.5; results["tape_m"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tape_m"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDrywall_calculator(input: Drywall_calculatorInput): Drywall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["tape_m"]));
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


export interface Drywall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
