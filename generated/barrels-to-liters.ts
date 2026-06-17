// @ts-nocheck
// Auto-generated from barrels-to-liters-schema.json
import * as z from 'zod';

export interface Barrels_to_litersInput {
  barrels: number;
  barrelType: number;
  auto_input_3: number;
}

export const Barrels_to_litersInputSchema = z.object({
  barrels: z.number().default(1),
  barrelType: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Barrels_to_litersInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.barrels * (input.barrelType === 1 ? 158.987294928 : input.barrelType === 2 ? 119.240471196 : 163.65924); results["liters"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["liters"] = 0; }
  try { const v = input.barrels * (input.barrelType === 1 ? 42 : input.barrelType === 2 ? 31.5 : 36); results["gallons"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["gallons"] = 0; }
  try { const v = (asFormulaNumber(results["liters"])) / 1000; results["cubicMeters"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cubicMeters"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBarrels_to_liters(input: Barrels_to_litersInput): Barrels_to_litersOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["liters"]);
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


export interface Barrels_to_litersOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
