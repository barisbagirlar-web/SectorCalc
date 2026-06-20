// Auto-generated from peaking-calculator-schema.json
import * as z from 'zod';

export interface Peaking_calculatorInput {
  peakDemand: number;
  offPeakDemand: number;
  peakHours: number;
  offPeakHours: number;
  peakRate: number;
  offPeakRate: number;
  dataConfidence?: number;
}

export const Peaking_calculatorInputSchema = z.object({
  peakDemand: z.number().default(100),
  offPeakDemand: z.number().default(50),
  peakHours: z.number().default(8),
  offPeakHours: z.number().default(16),
  peakRate: z.number().default(0.15),
  offPeakRate: z.number().default(0.05),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Peaking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.peakDemand * input.peakHours * input.peakRate; results["peakEnergyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["peakEnergyCost"] = Number.NaN; }
  try { const v = input.offPeakDemand * input.offPeakHours * input.offPeakRate; results["offPeakEnergyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["offPeakEnergyCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["peakEnergyCost"])) + (toNumericFormulaValue(results["offPeakEnergyCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculatePeaking_calculator(input: Peaking_calculatorInput): Peaking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Peaking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
