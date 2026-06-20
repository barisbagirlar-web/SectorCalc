// Auto-generated from filter-calculator-schema.json
import * as z from 'zod';

export interface Filter_calculatorInput {
  flowRate: number;
  viscosity: number;
  thickness: number;
  porosity: number;
  particleDiameter: number;
  filterArea: number;
  dataConfidence?: number;
}

export const Filter_calculatorInputSchema = z.object({
  flowRate: z.number().default(0.001),
  viscosity: z.number().default(0.001),
  thickness: z.number().default(0.1),
  porosity: z.number().default(0.4),
  particleDiameter: z.number().default(0.001),
  filterArea: z.number().default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Filter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (180 * input.viscosity * input.thickness * input.flowRate * (1 - input.porosity) ** 2) / (input.filterArea * input.porosity ** 3 * input.particleDiameter ** 2); results["pressureDrop"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pressureDrop"] = Number.NaN; }
  try { const v = (input.porosity ** 3 * input.particleDiameter ** 2) / (180 * (1 - input.porosity) ** 2); results["permeability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["permeability"] = Number.NaN; }
  return results;
}


export function calculateFilter_calculator(input: Filter_calculatorInput): Filter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pressureDrop"]);
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


export interface Filter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
