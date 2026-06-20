// Auto-generated from dac-calculator-schema.json
import * as z from 'zod';

export interface Dac_calculatorInput {
  airFlow: number;
  co2Concentration: number;
  captureEfficiency: number;
  operatingHours: number;
  energyPerTon: number;
  electricityPrice: number;
  dataConfidence?: number;
}

export const Dac_calculatorInputSchema = z.object({
  airFlow: z.number().default(1000),
  co2Concentration: z.number().default(415),
  captureEfficiency: z.number().default(50),
  operatingHours: z.number().default(8000),
  energyPerTon: z.number().default(2000),
  electricityPrice: z.number().default(0.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dac_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.airFlow * input.co2Concentration * input.captureEfficiency * input.operatingHours * 1.964e-11; results["annualCO2Captured"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualCO2Captured"] = Number.NaN; }
  try { const v = input.airFlow * input.co2Concentration * input.captureEfficiency * input.operatingHours * 1.964e-11 * input.energyPerTon; results["annualEnergyConsumption"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualEnergyConsumption"] = Number.NaN; }
  try { const v = input.airFlow * input.co2Concentration * input.captureEfficiency * input.operatingHours * 1.964e-11 * input.energyPerTon * input.electricityPrice; results["annualElectricityCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualElectricityCost"] = Number.NaN; }
  return results;
}


export function calculateDac_calculator(input: Dac_calculatorInput): Dac_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualCO2Captured"]);
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


export interface Dac_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
