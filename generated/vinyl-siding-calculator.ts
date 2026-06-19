// Auto-generated from vinyl-siding-calculator-schema.json
import * as z from 'zod';

export interface Vinyl_siding_calculatorInput {
  totalWallArea: number;
  doorWindowArea: number;
  panelCoverage: number;
  pricePerPanel: number;
  wastePercentage: number;
  dataConfidence?: number;
}

export const Vinyl_siding_calculatorInputSchema = z.object({
  totalWallArea: z.number().default(1000),
  doorWindowArea: z.number().default(100),
  panelCoverage: z.number().default(8),
  pricePerPanel: z.number().default(10),
  wastePercentage: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vinyl_siding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalWallArea - input.doorWindowArea; results["netArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netArea"] = 0; }
  try { const v = 1 + (input.wastePercentage / 100); results["wasteFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteFactor"] = 0; }
  try { const v = ((asFormulaNumber(results["netArea"])) * (asFormulaNumber(results["wasteFactor"]))) / input.panelCoverage; results["panelsNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["panelsNeeded"] = 0; }
  try { const v = (asFormulaNumber(results["netArea"])) * (input.wastePercentage / 100); results["wasteArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteArea"] = 0; }
  try { const v = (asFormulaNumber(results["panelsNeeded"])) * input.pricePerPanel; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVinyl_siding_calculator(input: Vinyl_siding_calculatorInput): Vinyl_siding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCost"]));
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


export interface Vinyl_siding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
