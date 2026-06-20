// Auto-generated from circuit-load-calculator-schema.json
import * as z from 'zod';

export interface Circuit_load_calculatorInput {
  voltage: number;
  currentPerDevice: number;
  powerFactor: number;
  numberOfDevices: number;
  safetyFactor: number;
  breakerRating: number;
  dataConfidence?: number;
}

export const Circuit_load_calculatorInputSchema = z.object({
  voltage: z.number().default(230),
  currentPerDevice: z.number().default(1),
  powerFactor: z.number().default(0.8),
  numberOfDevices: z.number().default(1),
  safetyFactor: z.number().default(1.25),
  breakerRating: z.number().default(16),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Circuit_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfDevices * input.currentPerDevice * input.safetyFactor; results["totalCurrent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCurrent"] = Number.NaN; }
  try { const v = input.voltage * (toNumericFormulaValue(results["totalCurrent"])); results["totalApparentPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalApparentPower"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalApparentPower"])) * input.powerFactor; results["totalRealPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRealPower"] = Number.NaN; }
  try { const v = input.breakerRating > 0 ? ((toNumericFormulaValue(results["totalCurrent"])) / input.breakerRating * 100) : null; results["loadPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["loadPercentage"] = Number.NaN; }
  return results;
}


export function calculateCircuit_load_calculator(input: Circuit_load_calculatorInput): Circuit_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRealPower"]);
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


export interface Circuit_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
