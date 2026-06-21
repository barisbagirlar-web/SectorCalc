// Auto-generated from fire-pump-power-calculator-schema.json
import * as z from 'zod';

export interface Fire_pump_power_calculatorInput {
  debi: number;
  basinc: number;
  pompaVerim: number;
  dataConfidence?: number;
}

export const Fire_pump_power_calculatorInputSchema = z.object({
  debi: z.number().min(0).default(1000),
  basinc: z.number().min(0).default(7),
  pompaVerim: z.number().min(0).default(75),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fire_pump_power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.debi * input.basinc * 100) / Math.max(0.0001, (600 * (input.pompaVerim / 100) * 746)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateFire_pump_power_calculator(input: Fire_pump_power_calculatorInput): Fire_pump_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low Q factor indicates broader frequency response."];
  const suggestedActions: string[] = ["Verify component tolerances affect circuit performance.","Use proper safety equipment for high voltage/current work."];
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
    unit: "HP",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Fire_pump_power_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fire_pump_power_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "HP",
  breakdownKeys: ["sonuc"],
} as const;

