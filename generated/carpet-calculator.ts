// Auto-generated from carpet-calculator-schema.json
import * as z from 'zod';

export interface Carpet_calculatorInput {
  roomLength: number;
  roomWidth: number;
  carpetRollWidth: number;
  carpetPricePerSqm: number;
  wasteFactor: number;
  installationCostPerSqm: number;
  dataConfidence?: number;
}

export const Carpet_calculatorInputSchema = z.object({
  roomLength: z.number().default(5),
  roomWidth: z.number().default(4),
  carpetRollWidth: z.number().default(4),
  carpetPricePerSqm: z.number().default(50),
  wasteFactor: z.number().default(10),
  installationCostPerSqm: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Carpet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roomLength * input.roomWidth * (1 + input.wasteFactor / 100); results["totalCarpetArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCarpetArea"] = 0; }
  try { const v = (asFormulaNumber(results["totalCarpetArea"])) * input.carpetPricePerSqm; results["materialCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = input.roomLength * input.roomWidth * input.installationCostPerSqm; results["installationCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["installationCost"] = 0; }
  try { const v = (asFormulaNumber(results["materialCost"])) + (asFormulaNumber(results["installationCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCarpet_calculator(input: Carpet_calculatorInput): Carpet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Carpet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
