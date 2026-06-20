// Auto-generated from bsfc-calculator-schema.json
import * as z from 'zod';

export interface Bsfc_calculatorInput {
  fuelVolumeFlow: number;
  fuelTemperature: number;
  fuelDensityRef: number;
  power: number;
  thermalExpansionCoeff: number;
  dataConfidence?: number;
}

export const Bsfc_calculatorInputSchema = z.object({
  fuelVolumeFlow: z.number().default(0),
  fuelTemperature: z.number().default(20),
  fuelDensityRef: z.number().default(0.84),
  power: z.number().default(0),
  thermalExpansionCoeff: z.number().default(0.00095),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bsfc_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fuelDensityRef / (1 + input.thermalExpansionCoeff * (input.fuelTemperature - 15)); results["densityCorrected"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["densityCorrected"] = Number.NaN; }
  try { const v = input.fuelVolumeFlow * (toNumericFormulaValue(results["densityCorrected"])); results["massFlow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["massFlow"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["massFlow"])) * 1000) / input.power; results["bsfc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bsfc"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bsfc"])) * 0.001644; results["bsfc_lb_hph"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bsfc_lb_hph"] = Number.NaN; }
  return results;
}


export function calculateBsfc_calculator(input: Bsfc_calculatorInput): Bsfc_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bsfc"]);
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


export interface Bsfc_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
