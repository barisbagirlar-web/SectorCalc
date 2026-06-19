// Auto-generated from therms-to-btu-calculator-schema.json
import * as z from 'zod';

export interface Therms_to_btu_calculatorInput {
  quantity: number;
  conversionFactor: number;
  energyContentAdjustment: number;
  precision: number;
  outputUnitFactor: number;
  dataConfidence?: number;
}

export const Therms_to_btu_calculatorInputSchema = z.object({
  quantity: z.number().default(1),
  conversionFactor: z.number().default(100000),
  energyContentAdjustment: z.number().default(0),
  precision: z.number().default(0),
  outputUnitFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Therms_to_btu_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.conversionFactor + input.energyContentAdjustment; results["adjustedFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedFactor"] = 0; }
  try { const v = input.quantity * (input.conversionFactor + input.energyContentAdjustment); results["rawBtu"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawBtu"] = 0; }
  try { const v = (asFormulaNumber(results["rawBtu"])) * input.outputUnitFactor; results["scaledOutput"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scaledOutput"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTherms_to_btu_calculator(input: Therms_to_btu_calculatorInput): Therms_to_btu_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["scaledOutput"]));
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


export interface Therms_to_btu_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
