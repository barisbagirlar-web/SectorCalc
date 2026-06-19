// Auto-generated from sheet-pile-calculator-schema.json
import * as z from 'zod';

export interface Sheet_pile_calculatorInput {
  pileLength: number;
  pileWidth: number;
  numberOfPiles: number;
  steelDensity: number;
  unitCost: number;
  installationCostPerPile: number;
  dataConfidence?: number;
}

export const Sheet_pile_calculatorInputSchema = z.object({
  pileLength: z.number().default(12),
  pileWidth: z.number().default(0.5),
  numberOfPiles: z.number().default(100),
  steelDensity: z.number().default(7850),
  unitCost: z.number().default(1.2),
  installationCostPerPile: z.number().default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sheet_pile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pileLength * input.pileWidth * input.numberOfPiles * 0.01; results["totalSteelVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSteelVolume"] = 0; }
  try { const v = (asFormulaNumber(results["totalSteelVolume"])) * input.steelDensity; results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeight"])) * input.unitCost; results["materialCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = input.numberOfPiles * input.installationCostPerPile; results["installationCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["installationCost"] = 0; }
  try { const v = (asFormulaNumber(results["materialCost"])) + (asFormulaNumber(results["installationCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSheet_pile_calculator(input: Sheet_pile_calculatorInput): Sheet_pile_calculatorOutput {
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


export interface Sheet_pile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
