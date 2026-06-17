// @ts-nocheck
// Auto-generated from pottery-calculator-schema.json
import * as z from 'zod';

export interface Pottery_calculatorInput {
  numberOfPieces: number;
  clayWeightPerPiece: number;
  clayCostPerKg: number;
  glazeUsagePerPiece: number;
  glazeCostPerLiter: number;
  firingCostPerPiece: number;
  overheadPercentage: number;
}

export const Pottery_calculatorInputSchema = z.object({
  numberOfPieces: z.number().default(10),
  clayWeightPerPiece: z.number().default(500),
  clayCostPerKg: z.number().default(2.5),
  glazeUsagePerPiece: z.number().default(30),
  glazeCostPerLiter: z.number().default(15),
  firingCostPerPiece: z.number().default(1.2),
  overheadPercentage: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pottery_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.numberOfPieces * input.clayWeightPerPiece) / 1000; results["totalClayKg"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalClayKg"] = 0; }
  try { const v = (asFormulaNumber(results["totalClayKg"])) * input.clayCostPerKg; results["totalClayCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalClayCost"] = 0; }
  try { const v = (input.numberOfPieces * input.glazeUsagePerPiece) / 1000; results["totalGlazeLiters"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalGlazeLiters"] = 0; }
  try { const v = (asFormulaNumber(results["totalGlazeLiters"])) * input.glazeCostPerLiter; results["totalGlazeCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalGlazeCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalClayCost"])) + (asFormulaNumber(results["totalGlazeCost"])); results["materialCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = input.numberOfPieces * input.firingCostPerPiece; results["firingCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["firingCost"] = 0; }
  try { const v = (asFormulaNumber(results["materialCost"])) + (asFormulaNumber(results["firingCost"])); results["subtotal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = 1 + (input.overheadPercentage / 100); results["overheadMultiplier"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overheadMultiplier"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) * (asFormulaNumber(results["overheadMultiplier"])); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / input.numberOfPieces; results["costPerPiece"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerPiece"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePottery_calculator(input: Pottery_calculatorInput): Pottery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["costPerPiece"]);
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


export interface Pottery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
