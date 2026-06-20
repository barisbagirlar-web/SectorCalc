// Auto-generated from siding-calculator-schema.json
import * as z from 'zod';

export interface Siding_calculatorInput {
  wallLength: number;
  wallHeight: number;
  windowCount: number;
  windowArea: number;
  doorCount: number;
  doorArea: number;
  sidingCoverage: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Siding_calculatorInputSchema = z.object({
  wallLength: z.number().default(20),
  wallHeight: z.number().default(3),
  windowCount: z.number().default(2),
  windowArea: z.number().default(1.5),
  doorCount: z.number().default(1),
  doorArea: z.number().default(2),
  sidingCoverage: z.number().default(1),
  wasteFactor: z.number().default(0.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Siding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallLength * input.wallHeight; results["totalWallArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWallArea"] = Number.NaN; }
  try { const v = input.windowCount * input.windowArea; results["windowOpeningsArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["windowOpeningsArea"] = Number.NaN; }
  try { const v = input.doorCount * input.doorArea; results["doorOpeningsArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["doorOpeningsArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWallArea"])) - ((toNumericFormulaValue(results["windowOpeningsArea"])) + (toNumericFormulaValue(results["doorOpeningsArea"]))); results["netWallArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netWallArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netWallArea"])) / input.sidingCoverage; results["panelsWithoutWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["panelsWithoutWaste"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["panelsWithoutWaste"])) * input.wasteFactor; results["wastePanels"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wastePanels"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["panelsWithoutWaste"])) + (toNumericFormulaValue(results["wastePanels"])); results["panelsNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["panelsNeeded"] = Number.NaN; }
  return results;
}


export function calculateSiding_calculator(input: Siding_calculatorInput): Siding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["panelsNeeded"]);
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


export interface Siding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
