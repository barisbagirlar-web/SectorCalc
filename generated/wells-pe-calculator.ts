// Auto-generated from wells-pe-calculator-schema.json
import * as z from 'zod';

export interface Wells_pe_calculatorInput {
  mudDensity: number;
  trueVerticalDepth: number;
  annularPressureLoss: number;
  gravity: number;
}

export const Wells_pe_calculatorInputSchema = z.object({
  mudDensity: z.number().default(1200),
  trueVerticalDepth: z.number().default(1000),
  annularPressureLoss: z.number().default(500000),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Wells_pe_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mudDensity + input.annularPressureLoss / (input.gravity * input.trueVerticalDepth); results["ecd_kgm3"] = Number.isFinite(v) ? v : 0; } catch { results["ecd_kgm3"] = 0; }
  try { const v = (input.mudDensity + input.annularPressureLoss / (input.gravity * input.trueVerticalDepth)) * 0.0083454; results["ecd_ppg"] = Number.isFinite(v) ? v : 0; } catch { results["ecd_ppg"] = 0; }
  return results;
}


export function calculateWells_pe_calculator(input: Wells_pe_calculatorInput): Wells_pe_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ecd_kgm3"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
