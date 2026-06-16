// Auto-generated from m-to-ft-calculator-schema.json
import * as z from 'zod';

export interface M_to_ft_calculatorInput {
  meters: number;
  conversionFactor: number;
  measurementUncertainty: number;
  temperatureOffset: number;
  decimalPlaces: number;
  applyCorrection: number;
}

export const M_to_ft_calculatorInputSchema = z.object({
  meters: z.number().default(1),
  conversionFactor: z.number().default(3.280839895),
  measurementUncertainty: z.number().default(0.001),
  temperatureOffset: z.number().default(0),
  decimalPlaces: z.number().default(3),
  applyCorrection: z.number().default(1),
});

function evaluateAllFormulas(input: M_to_ft_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.applyCorrection === 1 ? input.meters * (1 + input.temperatureOffset * 0.0000116) : input.meters; results["correctedMeters"] = Number.isFinite(v) ? v : 0; } catch { results["correctedMeters"] = 0; }
  try { const v = input.meters * input.conversionFactor; results["rawFeet"] = Number.isFinite(v) ? v : 0; } catch { results["rawFeet"] = 0; }
  try { const v = input.measurementUncertainty * input.conversionFactor; results["uncertaintyFeet"] = Number.isFinite(v) ? v : 0; } catch { results["uncertaintyFeet"] = 0; }
  try { const v = input.applyCorrection; results["applyCorrection"] = Number.isFinite(v) ? v : 0; } catch { results["applyCorrection"] = 0; }
  try { const v = Math.round(((input.applyCorrection === 1 ? input.meters * (1 + input.temperatureOffset * 0.0000116) : input.meters) * input.conversionFactor) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["feet"] = Number.isFinite(v) ? v : 0; } catch { results["feet"] = 0; }
  return results;
}


export function calculateM_to_ft_calculator(input: M_to_ft_calculatorInput): M_to_ft_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["feet"] ?? 0;
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


export interface M_to_ft_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
