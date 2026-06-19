// Auto-generated from circuit-training-calculator-schema.json
import * as z from 'zod';

export interface Circuit_training_calculatorInput {
  voltage: number;
  resistance1: number;
  resistance2: number;
  dataConfidence?: number;
}

export const Circuit_training_calculatorInputSchema = z.object({
  voltage: z.number().default(12),
  resistance1: z.number().default(1000),
  resistance2: z.number().default(2200),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Circuit_training_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.resistance1 + input.resistance2; results["totalResistance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalResistance"] = 0; }
  try { const v = input.voltage / (asFormulaNumber(results["totalResistance"])); results["current"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["current"] = 0; }
  try { const v = input.voltage * (asFormulaNumber(results["current"])); results["powerTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["powerTotal"] = 0; }
  try { const v = (asFormulaNumber(results["current"])) * (asFormulaNumber(results["current"])) * input.resistance1; results["powerR1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["powerR1"] = 0; }
  try { const v = (asFormulaNumber(results["current"])) * (asFormulaNumber(results["current"])) * input.resistance2; results["powerR2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["powerR2"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCircuit_training_calculator(input: Circuit_training_calculatorInput): Circuit_training_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["current"]);
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


export interface Circuit_training_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
