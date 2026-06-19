// Auto-generated from hardwood-flooring-calculator-schema.json
import * as z from 'zod';

export interface Hardwood_flooring_calculatorInput {
  roomLength: number;
  roomWidth: number;
  plankLength: number;
  plankWidth: number;
  pricePerSqFt: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Hardwood_flooring_calculatorInputSchema = z.object({
  roomLength: z.number().default(15),
  roomWidth: z.number().default(12),
  plankLength: z.number().default(48),
  plankWidth: z.number().default(6),
  pricePerSqFt: z.number().default(5),
  wasteFactor: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hardwood_flooring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roomLength * input.roomWidth; results["roomArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["roomArea"] = 0; }
  try { const v = (input.plankLength * input.plankWidth) / 144; results["plankAreaSqFt"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["plankAreaSqFt"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHardwood_flooring_calculator(input: Hardwood_flooring_calculatorInput): Hardwood_flooring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["plankAreaSqFt"]));
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


export interface Hardwood_flooring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
