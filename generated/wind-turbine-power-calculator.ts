// Auto-generated from wind-turbine-power-calculator-schema.json
import * as z from 'zod';

export interface Wind_turbine_power_calculatorInput {
  kanatCapi: number;
  ruzgarHizi: number;
  havaYogunlugu: number;
  Cp: number;
  dataConfidence?: number;
}

export const Wind_turbine_power_calculatorInputSchema = z.object({
  kanatCapi: z.number().min(0).default(80),
  ruzgarHizi: z.number().min(0).default(12),
  havaYogunlugu: z.number().min(0).default(1.225),
  Cp: z.number().min(0).default(0.4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wind_turbine_power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * Math.pow(input.kanatCapi / 2, 2); results["alan"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["alan"] = Number.NaN; }
  try { const v = 0.5 * input.havaYogunlugu * (Math.PI * Math.pow(input.kanatCapi / 2, 2)) * Math.pow(input.ruzgarHizi, 3) * input.Cp; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateWind_turbine_power_calculator(input: Wind_turbine_power_calculatorInput): Wind_turbine_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low SNR indicates poor signal quality.","High Q indicates narrow bandwidth."];
  const suggestedActions: string[] = ["Use proper shielding for sensitive measurements.","Consider efficiency losses in energy calculations."];
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
    unit: "W",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Wind_turbine_power_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Wind_turbine_power_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "W",
  breakdownKeys: ["sonuc"],
} as const;

