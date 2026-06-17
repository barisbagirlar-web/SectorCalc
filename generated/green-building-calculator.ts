// @ts-nocheck
// Auto-generated from green-building-calculator-schema.json
import * as z from 'zod';

export interface Green_building_calculatorInput {
  floorArea: number;
  electricity: number;
  gridFactor: number;
  gas: number;
  gasFactor: number;
  renewable: number;
}

export const Green_building_calculatorInputSchema = z.object({
  floorArea: z.number().default(1000),
  electricity: z.number().default(50000),
  gridFactor: z.number().default(0.475),
  gas: z.number().default(10000),
  gasFactor: z.number().default(0.184),
  renewable: z.number().default(10000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Green_building_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.electricity * input.gridFactor; results["electricityCarbon"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["electricityCarbon"] = 0; }
  try { const v = input.gas * input.gasFactor; results["gasCarbon"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["gasCarbon"] = 0; }
  try { const v = input.renewable * input.gridFactor; results["renewableSaved"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["renewableSaved"] = 0; }
  try { const v = input.electricity * input.gridFactor + input.gas * input.gasFactor - input.renewable * input.gridFactor; results["netCarbon"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netCarbon"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGreen_building_calculator(input: Green_building_calculatorInput): Green_building_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netCarbon"]);
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


export interface Green_building_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
