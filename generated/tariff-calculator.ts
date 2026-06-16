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

function evaluateAllFormulas(input: Tariff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.peakUsage / 100; results["peakEnergyFraction"] = Number.isFinite(v) ? v : 0; } catch { results["peakEnergyFraction"] = 0; }
  try { const v = input.consumption * (results["peakEnergyFraction"] ?? 0); results["peakEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["peakEnergy"] = 0; }
  try { const v = input.consumption - (results["peakEnergy"] ?? 0); results["offPeakEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["offPeakEnergy"] = 0; }
  try { const v = (results["peakEnergy"] ?? 0) * input.peakRate + (results["offPeakEnergy"] ?? 0) * input.offPeakRate; results["energyCost"] = Number.isFinite(v) ? v : 0; } catch { results["energyCost"] = 0; }
  try { const v = input.standingCharge * input.days; results["standingCost"] = Number.isFinite(v) ? v : 0; } catch { results["standingCost"] = 0; }
  try { const v = (results["energyCost"] ?? 0) + (results["standingCost"] ?? 0); results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (results["subtotal"] ?? 0) * (input.taxRate / 100); results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["subtotal"] ?? 0) + (results["taxAmount"] ?? 0); results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  return results;
}


export function calculateTariff_calculator(input: Tariff_calculatorInput): Tariff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Tariff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
