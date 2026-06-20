// Auto-generated from tariff-calculator-schema.json
import * as z from 'zod';

export interface Tariff_calculatorInput {
  consumption: number;
  peakRate: number;
  offPeakRate: number;
  peakUsage: number;
  standingCharge: number;
  days: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Tariff_calculatorInputSchema = z.object({
  consumption: z.number().default(1000),
  peakRate: z.number().default(0.15),
  offPeakRate: z.number().default(0.1),
  peakUsage: z.number().default(60),
  standingCharge: z.number().default(0.5),
  days: z.number().default(30),
  taxRate: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tariff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.peakUsage / 100; results["peakEnergyFraction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["peakEnergyFraction"] = Number.NaN; }
  try { const v = input.consumption * (toNumericFormulaValue(results["peakEnergyFraction"])); results["peakEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["peakEnergy"] = Number.NaN; }
  try { const v = input.consumption - (toNumericFormulaValue(results["peakEnergy"])); results["offPeakEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["offPeakEnergy"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["peakEnergy"])) * input.peakRate + (toNumericFormulaValue(results["offPeakEnergy"])) * input.offPeakRate; results["energyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyCost"] = Number.NaN; }
  try { const v = input.standingCharge * input.days; results["standingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["standingCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energyCost"])) + (toNumericFormulaValue(results["standingCost"])); results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["subtotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) + (toNumericFormulaValue(results["taxAmount"])); results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  return results;
}


export function calculateTariff_calculator(input: Tariff_calculatorInput): Tariff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total"]);
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


export interface Tariff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
