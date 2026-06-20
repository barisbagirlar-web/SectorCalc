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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wells_pe_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mudDensity + input.annularPressureLoss / (input.gravity * input.trueVerticalDepth); results["ecd_kgm3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ecd_kgm3"] = Number.NaN; }
  try { const v = (input.mudDensity + input.annularPressureLoss / (input.gravity * input.trueVerticalDepth)) * 0.0083454; results["ecd_ppg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ecd_ppg"] = Number.NaN; }
  return results;
}


export function calculateWells_pe_calculator(input: Wells_pe_calculatorInput): Wells_pe_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ecd_kgm3"]);
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


export interface Wells_pe_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
