// Auto-generated from kgf-cm2-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Kgf_cm2_to_psi_calculatorInput {
  pressureKgfCm2: number;
  conversionFactorConstant: number;
  decimalPlaces: number;
  outputScale: number;
  dataConfidence?: number;
}

export const Kgf_cm2_to_psi_calculatorInputSchema = z.object({
  pressureKgfCm2: z.number().default(0),
  conversionFactorConstant: z.number().default(14.22334330711986),
  decimalPlaces: z.number().default(2),
  outputScale: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kgf_cm2_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressureKgfCm2 * input.conversionFactorConstant * input.outputScale; results["rawPsiValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawPsiValue"] = 0; }
  try { const v = input.conversionFactorConstant; results["usedFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["usedFactor"] = 0; }
  try { const v = input.pressureKgfCm2; results["originalPressure"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["originalPressure"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKgf_cm2_to_psi_calculator(input: Kgf_cm2_to_psi_calculatorInput): Kgf_cm2_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["originalPressure"]);
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


export interface Kgf_cm2_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
