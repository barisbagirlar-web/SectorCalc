// Auto-generated from cable-sizing-calculator-schema.json
import * as z from 'zod';

export interface Cable_sizing_calculatorInput {
  loadCurrent: number;
  cableLength: number;
  supplyVoltage: number;
  voltageDropPercent: number;
  resistivity: number;
  safetyFactor: number;
  ambientTempFactor: number;
  dataConfidence?: number;
}

export const Cable_sizing_calculatorInputSchema = z.object({
  loadCurrent: z.number().default(10),
  cableLength: z.number().default(50),
  supplyVoltage: z.number().default(230),
  voltageDropPercent: z.number().default(3),
  resistivity: z.number().default(0.0172),
  safetyFactor: z.number().default(1.25),
  ambientTempFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cable_sizing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.supplyVoltage * (input.voltageDropPercent / 100); results["voltageDropVolts"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["voltageDropVolts"] = 0; }
  try { const v = (2 * input.cableLength * input.loadCurrent * input.resistivity * input.safetyFactor * input.ambientTempFactor) / (asFormulaNumber(results["voltageDropVolts"])); results["minCableArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["minCableArea"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCable_sizing_calculator(input: Cable_sizing_calculatorInput): Cable_sizing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["minCableArea"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Cable_sizing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
