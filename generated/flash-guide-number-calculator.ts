// Auto-generated from flash-guide-number-calculator-schema.json
import * as z from 'zod';

export interface Flash_guide_number_calculatorInput {
  distance: number;
  aperture: number;
  iso: number;
  flashPower: number;
  dataConfidence?: number;
}

export const Flash_guide_number_calculatorInputSchema = z.object({
  distance: z.number().default(5),
  aperture: z.number().default(8),
  iso: z.number().default(100),
  flashPower: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Flash_guide_number_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * input.aperture; results["effectiveGN"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveGN"] = 0; }
  try { const v = input.distance * input.aperture; results["effectiveGN_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveGN_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFlash_guide_number_calculator(input: Flash_guide_number_calculatorInput): Flash_guide_number_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effectiveGN_aux"]);
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


export interface Flash_guide_number_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
