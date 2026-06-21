// Auto-generated from thermal-conductivity-converter-calculator-schema.json
import * as z from 'zod';

export interface Thermal_conductivity_converter_calculatorInput {
  deger: number;
  kaynak: number;
  dataConfidence?: number;
}

export const Thermal_conductivity_converter_calculatorInputSchema = z.object({
  deger: z.number().min(0).default(1),
  kaynak: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Thermal_conductivity_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.kaynak === 0 ? input.deger : input.deger * 1.163) ? 1 : 0); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateThermal_conductivity_converter_calculator(input: Thermal_conductivity_converter_calculatorInput): Thermal_conductivity_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Use calibrated equipment for measurements.","Consider temperature effects on material properties."];
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
    unit: "W/mK",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Thermal_conductivity_converter_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Thermal_conductivity_converter_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "W/mK",
  breakdownKeys: ["sonuc"],
} as const;

