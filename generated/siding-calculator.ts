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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Siding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallLength * input.wallHeight; results["totalWallArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWallArea"] = 0; }
  try { const v = input.windowCount * input.windowArea; results["windowOpeningsArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["windowOpeningsArea"] = 0; }
  try { const v = input.doorCount * input.doorArea; results["doorOpeningsArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["doorOpeningsArea"] = 0; }
  try { const v = (asFormulaNumber(results["totalWallArea"])) - ((asFormulaNumber(results["windowOpeningsArea"])) + (asFormulaNumber(results["doorOpeningsArea"]))); results["netWallArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netWallArea"] = 0; }
  try { const v = (asFormulaNumber(results["netWallArea"])) / input.sidingCoverage; results["panelsWithoutWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["panelsWithoutWaste"] = 0; }
  try { const v = (asFormulaNumber(results["panelsWithoutWaste"])) * input.wasteFactor; results["wastePanels"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wastePanels"] = 0; }
  try { const v = (asFormulaNumber(results["panelsWithoutWaste"])) + (asFormulaNumber(results["wastePanels"])); results["panelsNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["panelsNeeded"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
