// Auto-generated from woodworking-calculator-schema.json
import * as z from 'zod';

export interface Woodworking_calculatorInput {
  length: number;
  width: number;
  thickness: number;
  quantity: number;
  wastePercent: number;
  density: number;
  costPerM3: number;
  dataConfidence?: number;
}

export const Woodworking_calculatorInputSchema = z.object({
  length: z.number().default(1000),
  width: z.number().default(500),
  thickness: z.number().default(18),
  quantity: z.number().default(10),
  wastePercent: z.number().default(5),
  density: z.number().default(700),
  costPerM3: z.number().default(12000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Woodworking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * input.thickness / 1e9; results["volumePerPiece"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumePerPiece"] = 0; }
  try { const v = (asFormulaNumber(results["volumePerPiece"])) * input.quantity; results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = (asFormulaNumber(results["totalVolume"])) * (1 + input.wastePercent / 100); results["totalVolumeWithWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVolumeWithWaste"] = 0; }
  try { const v = (asFormulaNumber(results["totalVolumeWithWaste"])) * input.density; results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (asFormulaNumber(results["totalVolumeWithWaste"])) * input.costPerM3; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWoodworking_calculator(input: Woodworking_calculatorInput): Woodworking_calculatorOutput {
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


export interface Woodworking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
