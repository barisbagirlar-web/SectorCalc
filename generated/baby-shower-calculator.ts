// Auto-generated from baby-shower-calculator-schema.json
import * as z from 'zod';

export interface Baby_shower_calculatorInput {
  numParts: number;
  flowRate: number;
  cycleTime: number;
  chemicalCostPerLiter: number;
  waterCostPerLiter: number;
  dataConfidence?: number;
}

export const Baby_shower_calculatorInputSchema = z.object({
  numParts: z.number().default(100),
  flowRate: z.number().default(10),
  cycleTime: z.number().default(5),
  chemicalCostPerLiter: z.number().default(0.5),
  waterCostPerLiter: z.number().default(0.002),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Baby_shower_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flowRate * input.cycleTime; results["totalWaterPerBatch"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWaterPerBatch"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWaterPerBatch"])) * input.waterCostPerLiter; results["totalWaterCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWaterCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWaterPerBatch"])) * input.chemicalCostPerLiter; results["totalChemicalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalChemicalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWaterCost"])) + (toNumericFormulaValue(results["totalChemicalCost"])); results["totalCostPerBatch"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCostPerBatch"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCostPerBatch"])) / input.numParts; results["costPerPiece"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerPiece"] = Number.NaN; }
  return results;
}


export function calculateBaby_shower_calculator(input: Baby_shower_calculatorInput): Baby_shower_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["costPerPiece"]);
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


export interface Baby_shower_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
