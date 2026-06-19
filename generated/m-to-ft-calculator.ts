// Auto-generated from m-to-ft-calculator-schema.json
import * as z from 'zod';

export interface M_to_ft_calculatorInput {
  meters: number;
  conversionFactor: number;
  measurementUncertainty: number;
  temperatureOffset: number;
  decimalPlaces: number;
  applyCorrection: number;
  dataConfidence?: number;
}

export const M_to_ft_calculatorInputSchema = z.object({
  meters: z.number().default(1),
  conversionFactor: z.number().default(3.280839895),
  measurementUncertainty: z.number().default(0.001),
  temperatureOffset: z.number().default(0),
  decimalPlaces: z.number().default(3),
  applyCorrection: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: M_to_ft_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.applyCorrection === 1 ? input.meters * (1 + input.temperatureOffset * 0.0000116) : input.meters; results["correctedMeters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["correctedMeters"] = 0; }
  try { const v = input.meters * input.conversionFactor; results["rawFeet"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawFeet"] = 0; }
  try { const v = input.measurementUncertainty * input.conversionFactor; results["uncertaintyFeet"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["uncertaintyFeet"] = 0; }
  try { const v = input.applyCorrection; results["applyCorrection"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["applyCorrection"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateM_to_ft_calculator(input: M_to_ft_calculatorInput): M_to_ft_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["applyCorrection"]));
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


export interface M_to_ft_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
