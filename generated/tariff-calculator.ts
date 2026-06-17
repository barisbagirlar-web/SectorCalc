// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tariff_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.peakUsage / 100; results["peakEnergyFraction"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["peakEnergyFraction"] = 0; }
  try { const v = input.consumption * (asFormulaNumber(results["peakEnergyFraction"])); results["peakEnergy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["peakEnergy"] = 0; }
  try { const v = input.consumption - (asFormulaNumber(results["peakEnergy"])); results["offPeakEnergy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["offPeakEnergy"] = 0; }
  try { const v = (asFormulaNumber(results["peakEnergy"])) * input.peakRate + (asFormulaNumber(results["offPeakEnergy"])) * input.offPeakRate; results["energyCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["energyCost"] = 0; }
  try { const v = input.standingCharge * input.days; results["standingCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["standingCost"] = 0; }
  try { const v = (asFormulaNumber(results["energyCost"])) + (asFormulaNumber(results["standingCost"])); results["subtotal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) + (asFormulaNumber(results["taxAmount"])); results["total"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTariff_calculator(input: Tariff_calculatorInput): Tariff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
