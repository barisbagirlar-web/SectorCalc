// Auto-generated from wire-mesh-calculator-schema.json
import * as z from 'zod';

export interface Wire_mesh_calculatorInput {
  wireDiameter: number;
  meshOpening: number;
  sheetWidth: number;
  sheetLength: number;
  quantity: number;
  materialDensity: number;
  dataConfidence?: number;
}

export const Wire_mesh_calculatorInputSchema = z.object({
  wireDiameter: z.number().default(1),
  meshOpening: z.number().default(10),
  sheetWidth: z.number().default(1),
  sheetLength: z.number().default(2),
  quantity: z.number().default(10),
  materialDensity: z.number().default(7850),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wire_mesh_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wireDiameter * input.meshOpening * input.sheetWidth * input.sheetLength; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.wireDiameter * input.meshOpening * input.sheetWidth * input.sheetLength * (input.quantity * input.materialDensity); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.quantity * input.materialDensity; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateWire_mesh_calculator(input: Wire_mesh_calculatorInput): Wire_mesh_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Wire_mesh_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
