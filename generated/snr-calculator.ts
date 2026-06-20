// Auto-generated from snr-calculator-schema.json
import * as z from 'zod';

export interface Snr_calculatorInput {
  signalVoltage: number;
  loadResistance: number;
  bandwidth: number;
  temperature: number;
  noiseFigure: number;
  dataConfidence?: number;
}

export const Snr_calculatorInputSchema = z.object({
  signalVoltage: z.number().default(1),
  loadResistance: z.number().default(50),
  bandwidth: z.number().default(1000000),
  temperature: z.number().default(290),
  noiseFigure: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Snr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.signalVoltage) * (input.loadResistance) * (input.bandwidth) * (input.temperature) * (input.noiseFigure); results["noiseFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["noiseFactor"] = Number.NaN; }
  try { const v = (input.signalVoltage) * (input.loadResistance) * (input.bandwidth); results["noiseFactor_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["noiseFactor_aux"] = Number.NaN; }
  return results;
}


export function calculateSnr_calculator(input: Snr_calculatorInput): Snr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["noiseFactor_aux"]);
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


export interface Snr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
