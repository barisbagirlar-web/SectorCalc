// Auto-generated from plant-spacing-calculator-schema.json
import * as z from 'zod';

export interface Plant_spacing_calculatorInput {
  bedLength: number;
  bedWidth: number;
  plantSpacing: number;
  rowSpacing: number;
  edgeSpacing: number;
  dataConfidence?: number;
}

export const Plant_spacing_calculatorInputSchema = z.object({
  bedLength: z.number().default(10),
  bedWidth: z.number().default(5),
  plantSpacing: z.number().default(0.5),
  rowSpacing: z.number().default(0.5),
  edgeSpacing: z.number().default(0.25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Plant_spacing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bedLength * input.bedWidth * input.plantSpacing * input.rowSpacing; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.bedLength * input.bedWidth * input.plantSpacing * input.rowSpacing * (input.edgeSpacing); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.edgeSpacing; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculatePlant_spacing_calculator(input: Plant_spacing_calculatorInput): Plant_spacing_calculatorOutput {
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


export interface Plant_spacing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
