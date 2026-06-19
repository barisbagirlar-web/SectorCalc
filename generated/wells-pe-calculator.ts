// Auto-generated from wells-pe-calculator-schema.json
import * as z from 'zod';

export interface Wells_pe_calculatorInput {
  mudDensity: number;
  trueVerticalDepth: number;
  annularPressureLoss: number;
  gravity: number;
  dataConfidence?: number;
}

export const Wells_pe_calculatorInputSchema = z.object({
  mudDensity: z.number().default(1200),
  trueVerticalDepth: z.number().default(1000),
  annularPressureLoss: z.number().default(500000),
  gravity: z.number().default(9.81),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wells_pe_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mudDensity + input.annularPressureLoss / (input.gravity * input.trueVerticalDepth); results["ecd_kgm3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ecd_kgm3"] = 0; }
  try { const v = (input.mudDensity + input.annularPressureLoss / (input.gravity * input.trueVerticalDepth)) * 0.0083454; results["ecd_ppg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ecd_ppg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWells_pe_calculator(input: Wells_pe_calculatorInput): Wells_pe_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["ecd_kgm3"]));
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


export interface Wells_pe_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
