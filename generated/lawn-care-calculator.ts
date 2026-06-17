// @ts-nocheck
// Auto-generated from lawn-care-calculator-schema.json
import * as z from 'zod';

export interface Lawn_care_calculatorInput {
  lawnArea: number;
  seedCost: number;
  fertilizerCost: number;
  irrigationCost: number;
  laborRate: number;
  laborHours: number;
  profitMargin: number;
}

export const Lawn_care_calculatorInputSchema = z.object({
  lawnArea: z.number().default(100),
  seedCost: z.number().default(0.5),
  fertilizerCost: z.number().default(0.3),
  irrigationCost: z.number().default(0.1),
  laborRate: z.number().default(25),
  laborHours: z.number().default(4),
  profitMargin: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lawn_care_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.seedCost + input.fertilizerCost + input.irrigationCost) * input.lawnArea; results["materialCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = input.laborRate * input.laborHours; results["laborCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (asFormulaNumber(results["materialCost"])) + (asFormulaNumber(results["laborCost"])); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / (1 - input.profitMargin / 100); results["sellingPrice"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sellingPrice"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLawn_care_calculator(input: Lawn_care_calculatorInput): Lawn_care_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sellingPrice"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Lawn_care_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
