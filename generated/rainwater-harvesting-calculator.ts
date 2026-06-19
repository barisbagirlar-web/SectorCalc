// Auto-generated from rainwater-harvesting-calculator-schema.json
import * as z from 'zod';

export interface Rainwater_harvesting_calculatorInput {
  roofArea: number;
  runoffCoeff: number;
  annualRainfall: number;
  filterEfficiency: number;
  dataConfidence?: number;
}

export const Rainwater_harvesting_calculatorInputSchema = z.object({
  roofArea: z.number().default(100),
  runoffCoeff: z.number().default(0.85),
  annualRainfall: z.number().default(800),
  filterEfficiency: z.number().default(90),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rainwater_harvesting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roofArea * input.annualRainfall * input.runoffCoeff * (input.filterEfficiency / 100); results["annualHarvest"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualHarvest"] = 0; }
  try { const v = (input.roofArea * input.annualRainfall * input.runoffCoeff * (input.filterEfficiency / 100)) / 12; results["monthlyAverage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyAverage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRainwater_harvesting_calculator(input: Rainwater_harvesting_calculatorInput): Rainwater_harvesting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualHarvest"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Rainwater_harvesting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
