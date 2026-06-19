// Auto-generated from concrete-footing-calculator-schema.json
import * as z from 'zod';

export interface Concrete_footing_calculatorInput {
  FootingLength: number;
  FootingWidth: number;
  FootingDepth: number;
  NumberOfFootings: number;
  WasteFactor: number;
  dataConfidence?: number;
}

export const Concrete_footing_calculatorInputSchema = z.object({
  FootingLength: z.number().default(2),
  FootingWidth: z.number().default(2),
  FootingDepth: z.number().default(0.5),
  NumberOfFootings: z.number().default(1),
  WasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Concrete_footing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.FootingLength * input.FootingWidth * input.FootingDepth * input.NumberOfFootings; results["volumeWithoutWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeWithoutWaste"] = 0; }
  try { const v = input.FootingLength * input.FootingWidth * input.FootingDepth * input.NumberOfFootings * (1 + input.WasteFactor / 100); results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = (asFormulaNumber(results["totalVolume"])) - (asFormulaNumber(results["volumeWithoutWaste"])); results["wasteAddition"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteAddition"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateConcrete_footing_calculator(input: Concrete_footing_calculatorInput): Concrete_footing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalVolume"]));
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


export interface Concrete_footing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
